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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Tennis Courts
              <span className="text-emerald-600"> Tbilisi</span>
            </h1>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-900">
                    Welcome, {user.name}
                  </div>
                  <div className="text-xs text-slate-500 capitalize font-medium">
                    {user.role.toLowerCase().replace('_', ' ')}
                  </div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                {user.role === 'COURT_OWNER' && (
                  <Link
                    href="/dashboard"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === 'CUSTOMER' && (
                  <Link
                    href="/my-bookings"
                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-5 py-2.5 rounded-lg hover:from-emerald-700 hover:to-emerald-800 text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    My Bookings
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-slate-800 font-semibold text-sm px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Find & Book Tennis Courts
            <span className="block text-emerald-600">in Tbilisi</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            No more phone calls - book your court online instantly with guaranteed reservations
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent mx-auto mb-6"></div>
            <p className="text-lg text-slate-600 font-medium">Loading courts...</p>
          </div>
        ) : (
          <div>
            {courts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-12 h-12 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  No courts available yet
                </h3>
                <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
                  We&apos;re working with court owners to bring you the best tennis facilities in Tbilisi.
                </p>
                {user.role === 'COURT_OWNER' ? (
                  <Link
                    href="/dashboard"
                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 inline-flex items-center font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                  >
                    Add Your Court
                  </Link>
                ) : (
                  <Link
                    href="/auth/register?role=COURT_OWNER"
                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 inline-flex items-center font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                  >
                    List Your Court
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courts.map((court) => (
                  <div key={court.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100">
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-xl font-bold text-slate-900">
                          {court.name}
                        </h3>
                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                          court.indoor
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {court.indoor ? 'Indoor' : 'Outdoor'}
                        </span>
                      </div>

                      <div className="flex items-center mb-4">
                        <svg className="w-4 h-4 text-slate-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-slate-600 font-medium">{court.address}</p>
                      </div>

                      {court.description && (
                        <p className="text-slate-500 mb-6 leading-relaxed">{court.description}</p>
                      )}

                      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                        <div>
                          <p className="text-3xl font-black text-emerald-600">
                            {formatPrice(court.hourlyRate)}
                          </p>
                          <p className="text-sm text-slate-500 font-medium">per hour</p>
                        </div>
                        <Link
                          href={`/courts/${court.id}`}
                          className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-800 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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