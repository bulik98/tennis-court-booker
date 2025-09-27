'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Court {
  id: string
  name: string
  address: string
  hourlyRate: number
  indoor: boolean
  description?: string
  owner: {
    name: string
    phone: string
  }
  slots: TimeSlot[]
}

interface TimeSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  isBooked: boolean
}

export default function CourtDetail() {
  const params = useParams()
  const [court, setCourt] = useState<Court | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  const fetchCourt = useCallback(async () => {
    try {
      const response = await fetch(`/api/courts/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setCourt(data)

        // Set default date to today
        const today = new Date().toISOString().split('T')[0]
        setSelectedDate(today)
      }
    } catch (error) {
      console.error('Error fetching court:', error)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    if (params.id) {
      fetchCourt()
    }
  }, [params.id, fetchCourt])

  useEffect(() => {
    if (court && selectedDate) {
      const dateSlots = court.slots.filter(slot =>
        slot.date.split('T')[0] === selectedDate && !slot.isBooked
      )
      setAvailableSlots(dateSlots)
    }
  }, [court, selectedDate])

  const handleBookSlot = async (slotId: string) => {
    const token = localStorage.getItem('token')

    if (!token) {
      setShowLoginPrompt(true)
      return
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          slotId,
          courtId: params.id
        })
      })

      if (response.ok) {
        alert('Booking successful!')
        fetchCourt() // Refresh the court data
      } else {
        const data = await response.json()
        alert(data.error || 'Booking failed')
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('Booking failed')
    }
  }

  const formatPrice = (price: number) => {
    return `${(price / 100).toFixed(2)} ₾`
  }

  const formatTime = (time: string) => {
    return time.slice(0, 5) // Remove seconds
  }

  const getNextSevenDays = () => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!court) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Court not found</h2>
          <Link href="/" className="text-green-600 hover:text-green-700">
            Back to courts
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-green-600 hover:text-green-700">
            ← Back to courts
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{court.name}</h1>
                <p className="text-gray-600 mb-2">{court.address}</p>
                {court.description && (
                  <p className="text-gray-500">{court.description}</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {formatPrice(court.hourlyRate)}
                </div>
                <div className="text-sm text-gray-500">per hour</div>
                <span className={`inline-block px-3 py-1 text-sm rounded-full mt-2 ${
                  court.indoor
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {court.indoor ? 'Indoor' : 'Outdoor'}
                </span>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Book a Time Slot</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {getNextSevenDays().map((date) => {
                    const dateObj = new Date(date)
                    const dayName = dateObj.toLocaleDateString('en', { weekday: 'short' })
                    const dayNumber = dateObj.getDate()

                    return (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`p-3 text-center rounded-md border ${
                          selectedDate === date
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-xs">{dayName}</div>
                        <div className="font-semibold">{dayNumber}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {selectedDate && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Available Times for {new Date(selectedDate).toLocaleDateString()}
                  </h3>

                  {availableSlots.length === 0 ? (
                    <p className="text-gray-600">No available time slots for this date.</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => handleBookSlot(slot.id)}
                          className="p-3 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 text-green-800 font-medium"
                        >
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h3>
              <p className="text-gray-600">Owner: {court.owner.name}</p>
              {court.owner.phone && (
                <p className="text-gray-600">Phone: {court.owner.phone}</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {showLoginPrompt && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Login Required</h3>
            <p className="text-gray-600 mb-6">You need to login to book a court.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <Link
                href="/auth/login"
                className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 text-center"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}