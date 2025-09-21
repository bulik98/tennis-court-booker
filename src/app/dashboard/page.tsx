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
  isActive: boolean
  description?: string
}

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [courts, setCourts] = useState<Court[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddCourt, setShowAddCourt] = useState(false)
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
    if (parsedUser.role !== 'COURT_OWNER') {
      router.push('/')
      return
    }

    setUser(parsedUser)
    fetchCourts(token)
  }, [router, mounted])

  const fetchCourts = async (token: string) => {
    try {
      const response = await fetch('/api/courts/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCourts(data)
      }
    } catch (error) {
      console.error('Error fetching courts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const formatPrice = (price: number) => {
    return `${(price / 100).toFixed(2)} ₾`
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
                Court Owner Dashboard
              </h1>
              <p className="text-gray-600">Welcome, {user.name}</p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                View Site
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
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Courts</h2>
            <button
              onClick={() => setShowAddCourt(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Add New Court
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading courts...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 mb-4">You haven't added any courts yet.</p>
                  <button
                    onClick={() => setShowAddCourt(true)}
                    className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700"
                  >
                    Add Your First Court
                  </button>
                </div>
              ) : (
                courts.map((court) => (
                  <div key={court.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {court.name}
                        </h3>
                        <div className="flex space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            court.indoor
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {court.indoor ? 'Indoor' : 'Outdoor'}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            court.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {court.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
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
                          href={`/dashboard/courts/${court.id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                          Manage
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {showAddCourt && <AddCourtModal onClose={() => setShowAddCourt(false)} onSuccess={() => {
          setShowAddCourt(false)
          const token = localStorage.getItem('token')
          if (token) fetchCourts(token)
        }} />}
      </main>
    </div>
  )
}

function AddCourtModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    hourlyRate: '',
    indoor: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/courts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          hourlyRate: Math.round(parseFloat(formData.hourlyRate) * 100) // Convert to tetri
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create court')
      }

      onSuccess()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Add New Court</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Court Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hourly Rate (₾)</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.hourlyRate}
              onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.indoor}
              onChange={(e) => setFormData({...formData, indoor: e.target.checked})}
              className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label className="ml-2 block text-sm text-gray-700">Indoor court</label>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Court'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}