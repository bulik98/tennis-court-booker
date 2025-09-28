'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Booking {
  id: string
  date: string
  startTime: string
  endTime: string
  totalAmount: number
  commission: number
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  notes?: string
  createdAt: string
  court: {
    id: string
    name: string
    address: string
    indoor: boolean
    owner: {
      name: string
      phone?: string
    }
  }
}

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function MyBookings() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
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

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'CUSTOMER') {
      router.push('/dashboard')
      return
    }

    setUser(parsedUser)
    fetchBookings(token)
  }, [router, mounted])

  const fetchBookings = async (token: string) => {
    try {
      const response = await fetch('/api/bookings/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      } else {
        console.error('Failed to fetch bookings')
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return `${(price / 100).toFixed(2)} ₾`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const canCancelBooking = (booking: Booking) => {
    const bookingDate = new Date(booking.date)
    const now = new Date()
    const timeDiff = bookingDate.getTime() - now.getTime()
    const hoursDiff = timeDiff / (1000 * 3600)

    return hoursDiff > 24 && (booking.status === 'PENDING' || booking.status === 'CONFIRMED')
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        // Refresh bookings
        fetchBookings(token!)
      } else {
        alert('Failed to cancel booking')
      }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      alert('Failed to cancel booking')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Bookings
              </h1>
              <p className="text-gray-600">Welcome, {user.name}</p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Browse Courts
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-700 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your bookings...</p>
          </div>
        ) : (
          <div>
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🎾</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No bookings yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start by browsing available tennis courts and make your first booking!
                </p>
                <Link
                  href="/"
                  className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 inline-flex items-center"
                >
                  Browse Courts
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Your Tennis Court Bookings ({bookings.length})
                  </h2>
                </div>

                <div className="grid gap-6">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {booking.court.name}
                          </h3>
                          <p className="text-gray-600">{booking.court.address}</p>
                          <div className="flex items-center mt-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              booking.court.indoor
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {booking.court.indoor ? 'Indoor' : 'Outdoor'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900">Date & Time</h4>
                          <p className="text-gray-600">{formatDate(booking.date)}</p>
                          <p className="text-gray-600">{booking.startTime} - {booking.endTime}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Court Owner</h4>
                          <p className="text-gray-600">{booking.court.owner.name}</p>
                          {booking.court.owner.phone && (
                            <p className="text-gray-600">{booking.court.owner.phone}</p>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Booking Details</h4>
                          <p className="text-gray-600">
                            Total: {formatPrice(booking.totalAmount)}
                          </p>
                          <p className="text-gray-500 text-sm">
                            (Platform fee: {formatPrice(booking.commission)})
                          </p>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900">Notes</h4>
                          <p className="text-gray-600">{booking.notes}</p>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-4 border-t">
                        <p className="text-sm text-gray-500">
                          Booked on {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex space-x-3">
                          <Link
                            href={`/courts/${booking.court.id}`}
                            className="text-green-600 hover:text-green-700 font-medium"
                          >
                            View Court
                          </Link>
                          {canCancelBooking(booking) && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="text-red-600 hover:text-red-700 font-medium"
                            >
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}