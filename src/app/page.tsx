'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
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
      // Redirect logged-in users to courts page
      router.push('/courts')
    } else {
      // Redirect to landing page if not logged in
      router.push('/landing')
    }
  }, [mounted, router])

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium">Loading Tennis Courts Tbilisi...</p>
      </div>
    </div>
  )
}