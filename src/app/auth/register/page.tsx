'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') || 'CUSTOMER'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: defaultRole
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      if (data.user.role === 'COURT_OWNER') {
        router.push('/dashboard')
      } else {
        router.push('/')
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 relative overflow-hidden py-12">
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>
      </div>

      <div className="relative max-w-md w-full">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2">
              Tennis Courts
              <span className="block text-emerald-600">Tbilisi</span>
            </h1>
            <h2 className="text-xl font-semibold text-slate-700 mb-4">
              Create Your Account
            </h2>
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-slate-700 mb-2">
                  Account Type
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 bg-white/80 backdrop-blur-sm transition-all duration-300"
                >
                  <option value="CUSTOMER">Tennis Player</option>
                  <option value="COURT_OWNER">Court Owner</option>
                </select>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 bg-white/80 backdrop-blur-sm transition-all duration-300 placeholder-slate-400"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 bg-white/80 backdrop-blur-sm transition-all duration-300 placeholder-slate-400"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 bg-white/80 backdrop-blur-sm transition-all duration-300 placeholder-slate-400"
                  placeholder="Enter your phone number (optional)"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 bg-white/80 backdrop-blur-sm transition-all duration-300 placeholder-slate-400"
                  placeholder="Create a secure password"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function Register() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}