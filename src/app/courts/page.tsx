'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
    phone?: string
  }
}

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function CourtsPage() {
  const router = useRouter()
  const [courts, setCourts] = useState<Court[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Check if user is logged in
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (userData && token) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } else {
      router.push('/landing')
      return
    }
  }, [mounted, router])

  useEffect(() => {
    fetchCourts()
  }, [])

  const fetchCourts = async () => {
    try {
      const response = await fetch('/api/courts')

      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText)
        setCourts([])
        return
      }

      const data = await response.json()

      if (Array.isArray(data)) {
        setCourts(data)
      } else {
        console.error('API returned non-array data:', data)
        setCourts([])
      }
    } catch (error) {
      console.error('Error fetching courts:', error)
      setCourts([])
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return `${(price / 100).toFixed(2)} ₾`
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/landing')
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
            <h1 className="text-3xl font-bold text-gray-900">
              Tennis Courts Tbilisi
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    Welcome, {user.name}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user.role.toLowerCase().replace('_', ' ')}
                  </div>
                </div>
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                {user.role === 'COURT_OWNER' && (
                  <Link
                    href="/dashboard"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === 'CUSTOMER' && (
                  <Link
                    href="/my-bookings"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                  >
                    My Bookings
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-700 font-medium text-sm px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find and Book Tennis Courts in Tbilisi
          </h2>
          <p className="text-xl text-gray-600">
            No more phone calls - book your court online instantly
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading courts...</p>
          </div>
        ) : (
          <div>
            {courts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🎾</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No courts available yet
                </h3>
                <p className="text-gray-600 mb-6">
                  We're working with court owners to bring you the best tennis facilities in Tbilisi.
                </p>
                {user.role === 'COURT_OWNER' ? (
                  <Link
                    href="/dashboard"
                    className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 inline-flex items-center"
                  >
                    Add Your Court
                  </Link>
                ) : (
                  <Link
                    href="/auth/register?role=COURT_OWNER"
                    className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 inline-flex items-center"
                  >
                    List Your Court
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courts.map((court) => (
                  <div key={court.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {court.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          court.indoor
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {court.indoor ? 'Indoor' : 'Outdoor'}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-2">{court.address}</p>

                      {court.description && (
                        <p className="text-gray-500 text-sm mb-4">{court.description}</p>
                      )}

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-2xl font-bold text-green-600">
                            {formatPrice(court.hourlyRate)}
                          </p>
                          <p className="text-sm text-gray-500">per hour</p>
                        </div>
                        <Link
                          href={`/courts/${court.id}`}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}