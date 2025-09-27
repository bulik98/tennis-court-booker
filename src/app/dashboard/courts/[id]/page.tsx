'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Court {
  id: string
  name: string
  address: string
  hourlyRate: number
  indoor: boolean
  isActive: boolean
  description?: string
}

interface TimeSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  isBooked: boolean
  booking?: {
    id: string
    customer: {
      name: string
      email: string
      phone?: string
    }
  }
}

interface Booking {
  id: string
  date: string
  startTime: string
  endTime: string
  totalAmount: number
  commission: number
  status: string
  customer: {
    name: string
    email: string
    phone?: string
  }
}

export default function CourtManagement() {
  const params = useParams()
  const router = useRouter()
  const [court, setCourt] = useState<Court | null>(null)
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')
  const [activeTab, setActiveTab] = useState('availability')
  const [showAddSlot, setShowAddSlot] = useState(false)
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/auth/login')
      return
    }

    const user = JSON.parse(userData)
    if (user.role !== 'COURT_OWNER') {
      router.push('/')
      return
    }

    if (params.id) {
      fetchCourtData()
    }
  }, [params.id, router, mounted])

  useEffect(() => {
    if (selectedDate && court) {
      fetchSlots(selectedDate)
    }
  }, [selectedDate, court])

  const fetchCourtData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/courts/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCourt(data)

        // Set default date to today
        const today = new Date().toISOString().split('T')[0]
        setSelectedDate(today)

        // Fetch bookings
        fetchBookings()
      }
    } catch (error) {
      console.error('Error fetching court:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSlots = async (date: string) => {
    try {
      const response = await fetch(`/api/courts/${params.id}/slots?date=${date}`)
      if (response.ok) {
        const data = await response.json()
        setSlots(data)
      }
    } catch (error) {
      console.error('Error fetching slots:', error)
    }
  }

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/courts/${params.id}/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const generateSlots = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/courts/${params.id}/slots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          date: selectedDate,
          startHour: 8,
          endHour: 22
        })
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        fetchSlots(selectedDate)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to generate slots')
      }
    } catch (error) {
      console.error('Error generating slots:', error)
      alert('Failed to generate slots')
    }
  }

  const deleteSlot = async (slotId: string) => {
    if (!confirm('Are you sure you want to delete this time slot?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/courts/${params.id}/slots`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ slotId })
      })

      if (response.ok) {
        alert('Slot deleted successfully')
        fetchSlots(selectedDate)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete slot')
      }
    } catch (error) {
      console.error('Error deleting slot:', error)
      alert('Failed to delete slot')
    }
  }

  const createCustomSlot = async (startTime: string, endTime: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/courts/${params.id}/slots/custom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          date: selectedDate,
          startTime,
          endTime
        })
      })

      if (response.ok) {
        alert('Custom slot created successfully')
        fetchSlots(selectedDate)
        setShowAddSlot(false)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to create slot')
      }
    } catch (error) {
      console.error('Error creating slot:', error)
      alert('Failed to create slot')
    }
  }

  const formatPrice = (price: number) => {
    return `${(price / 100).toFixed(2)} ₾`
  }

  const formatTime = (time: string) => {
    return time.slice(0, 5)
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

  if (!mounted || loading) {
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
          <Link href="/dashboard" className="text-green-600 hover:text-green-700">
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="text-green-600 hover:text-green-700">
            ← Back to dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{court.name}</h1>
                <p className="text-gray-600">{court.address}</p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  {formatPrice(court.hourlyRate)} per hour
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                court.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {court.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Tabs */}
            <div className="border-b mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('availability')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'availability'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Availability Management
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'bookings'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Bookings
                </button>
              </nav>
            </div>

            {/* Availability Management Tab */}
            {activeTab === 'availability' && (
              <div>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Manage Availability</h2>
                    <button
                      onClick={generateSlots}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      Generate Slots for {selectedDate}
                    </button>
                  </div>

                  <div className="mb-4">
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
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Time Slots for {new Date(selectedDate).toLocaleDateString()}
                        </h3>
                        <button
                          onClick={() => setShowAddSlot(true)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
                        >
                          + Add Custom Slot
                        </button>
                      </div>

                      {slots.length === 0 ? (
                        <p className="text-gray-600">No time slots created for this date.</p>
                      ) : (
                        <div className="space-y-2">
                          {slots.map((slot) => (
                            <div
                              key={slot.id}
                              className={`p-4 rounded-md border flex justify-between items-center ${
                                slot.isBooked
                                  ? 'bg-red-50 border-red-200'
                                  : 'bg-green-50 border-green-200'
                              }`}
                            >
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                </div>
                                <div className={`text-sm ${
                                  slot.isBooked ? 'text-red-700' : 'text-green-700'
                                }`}>
                                  {slot.isBooked ? 'Booked' : 'Available'}
                                </div>
                                {slot.booking && (
                                  <div className="text-sm text-gray-600 mt-1">
                                    Customer: {slot.booking.customer.name}
                                  </div>
                                )}
                              </div>

                              <div className="flex space-x-2">
                                {!slot.isBooked && (
                                  <>
                                    <button
                                      onClick={() => setEditingSlot(slot)}
                                      className="text-blue-600 hover:text-blue-700 text-sm px-2 py-1 border border-blue-300 rounded hover:bg-blue-50"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => deleteSlot(slot.id)}
                                      className="text-red-600 hover:text-red-700 text-sm px-2 py-1 border border-red-300 rounded hover:bg-red-50"
                                    >
                                      Delete
                                    </button>
                                  </>
                                )}
                                {slot.isBooked && (
                                  <span className="text-gray-500 text-sm px-2 py-1">
                                    Cannot modify booked slot
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Bookings</h2>

                {bookings.length === 0 ? (
                  <p className="text-gray-600">No bookings yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Commission
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.map((booking) => (
                          <tr key={booking.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div>
                                {new Date(booking.date).toLocaleDateString()}
                              </div>
                              <div className="text-gray-500">
                                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div>{booking.customer.name}</div>
                              <div className="text-gray-500">{booking.customer.email}</div>
                              {booking.customer.phone && (
                                <div className="text-gray-500">{booking.customer.phone}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatPrice(booking.totalAmount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatPrice(booking.commission)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                booking.status === 'CONFIRMED'
                                  ? 'bg-green-100 text-green-800'
                                  : booking.status === 'PENDING'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Custom Slot Modal */}
      {showAddSlot && (
        <SlotModal
          isEdit={false}
          onClose={() => setShowAddSlot(false)}
          onSave={createCustomSlot}
        />
      )}

      {/* Edit Slot Modal */}
      {editingSlot && (
        <SlotModal
          isEdit={true}
          slot={editingSlot}
          onClose={() => setEditingSlot(null)}
          onSave={() => {
            // Update existing slot logic here
            setEditingSlot(null)
          }}
        />
      )}
    </div>
  )
}

// Slot Modal Component
function SlotModal({
  isEdit,
  slot,
  onClose,
  onSave
}: {
  isEdit: boolean
  slot?: TimeSlot
  onClose: () => void
  onSave: (startTime: string, endTime: string) => void
}) {
  const [startTime, setStartTime] = useState(slot?.startTime || '09:00')
  const [endTime, setEndTime] = useState(slot?.endTime || '10:00')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (startTime >= endTime) {
      alert('End time must be after start time')
      return
    }

    setLoading(true)
    try {
      await onSave(startTime, endTime)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {isEdit ? 'Edit Time Slot' : 'Add Custom Time Slot'}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
          </div>
        </div>

        <div className="flex space-x-3 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
          </button>
        </div>
      </div>
    </div>
  )
}