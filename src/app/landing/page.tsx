'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Landing() {
  const [activeTab, setActiveTab] = useState<'players' | 'owners'>('players')

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              🎾 Tennis Courts Tbilisi
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-4 max-w-3xl mx-auto">
              End the frustration of phone booking! Instant bookings, no more waiting, no more lost reservations.
            </p>
            <div className="bg-yellow-400 text-black px-6 py-3 rounded-full font-bold text-lg mb-8 inline-block">
              🎉 YOUR FIRST GAME IS FREE! 🎉
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register?role=CUSTOMER"
                className="bg-yellow-400 text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors shadow-lg transform hover:scale-105"
              >
                🎾 Book Your First Game FREE!
              </Link>
              <Link
                href="/auth/register?role=COURT_OWNER"
                className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors border-2 border-white"
              >
                💰 List Your Court
              </Link>
            </div>
          </div>
        </div>
        {/* Tennis ball decoration */}
        <div className="absolute top-10 right-10 text-6xl opacity-30">🎾</div>
        <div className="absolute bottom-10 left-10 text-4xl opacity-30">🎾</div>
        <div className="absolute top-1/3 left-1/4 text-2xl opacity-20">🏆</div>
        <div className="absolute bottom-1/3 right-1/4 text-3xl opacity-20">⚡</div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              🚫 No More Phone Tag for Tennis Courts in Tbilisi!
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tired of endless calls? Fed up with uncertain reservations that disappear by tomorrow?
              We've solved Tbilisi's tennis booking nightmare - 40 courts and counting! 🎾
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">📞</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Endless Phone Calls</h3>
              <p className="text-gray-600">
                Calling 10+ courts, waiting on hold, getting busy signals, and STILL no court available.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">❌</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lost Reservations</h3>
              <p className="text-gray-600">
                Your booking mysteriously disappears by tomorrow - no guarantee you'll actually play.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Endless Waiting</h3>
              <p className="text-gray-600">
                Long wait times just to hear "maybe tomorrow" - spending more time booking than playing!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Tabs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Built for Players & Court Owners
            </h2>
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('players')}
                  className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                    activeTab === 'players'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  For Tennis Players
                </button>
                <button
                  onClick={() => setActiveTab('owners')}
                  className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                    activeTab === 'owners'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  For Court Owners
                </button>
              </div>
            </div>
          </div>

          {activeTab === 'players' && (
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Book Courts in Seconds, Not Hours
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-green-600 text-xl mr-3">⚡</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Instant Booking</h4>
                      <p className="text-gray-600">Book courts in seconds, not hours - across 40 courts in Tbilisi!</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-green-600 text-xl mr-3">💰</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Pay Instantly, Zero Commission</h4>
                      <p className="text-gray-600">Secure instant payment - no hidden fees for players!</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-green-600 text-xl mr-3">🎾</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Your First Game is FREE</h4>
                      <p className="text-gray-600">Try any court in our network completely free - no risk!</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-green-600 text-xl mr-3">🔒</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Guaranteed Reservations</h4>
                      <p className="text-gray-600">Your booking WON'T disappear - stable, reliable reservations</p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/auth/register?role=CUSTOMER"
                  className="inline-block mt-8 bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors shadow-lg transform hover:scale-105"
                >
                  🎾 Book Your First Game FREE!
                </Link>
              </div>
              <div className="bg-green-50 rounded-lg p-8 border-2 border-green-200">
                <div className="text-6xl text-center mb-4">🎾</div>
                <h4 className="text-lg font-semibold text-center text-gray-900 mb-4">
                  "No more calling 15 courts every morning! Now I book in 30 seconds and actually PLAY tennis!"
                </h4>
                <p className="text-gray-600 text-center font-medium">
                  - Giorgi M., Vake Tennis Player
                </p>
              </div>
            </div>
          )}

          {activeTab === 'owners' && (
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Turn Your Court Into Steady Income
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-green-600 text-xl mr-3">📈</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Fill Every Empty Slot</h4>
                      <p className="text-gray-600">Connect with players actively searching - maximize your court revenue!</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-green-600 text-xl mr-3">🤖</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">No More Phone Management</h4>
                      <p className="text-gray-600">We handle all bookings, payments, and scheduling automatically</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-green-600 text-xl mr-3">💰</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Zero Commission - FREE App</h4>
                      <p className="text-gray-600">Keep 100% of your earnings! We make money from premium features only</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-green-600 text-xl mr-3">⚡</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Instant Payments</h4>
                      <p className="text-gray-600">Players pay instantly when booking - guaranteed revenue</p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/auth/register?role=COURT_OWNER"
                  className="inline-block mt-8 bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg"
                >
                  💰 List Your Court FREE - No Commission!
                </Link>
              </div>
              <div className="bg-green-50 rounded-lg p-8 border-2 border-green-200">
                <div className="text-6xl text-center mb-4">💰</div>
                <h4 className="text-lg font-semibold text-center text-gray-900 mb-4">
                  "Finally no more phone bookings! My revenue increased 60% and I keep 100% - amazing!"
                </h4>
                <p className="text-gray-600 text-center font-medium">
                  - Nino K., Premier Court Owner in Vake
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to book or list your tennis court
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sign Up</h3>
              <p className="text-gray-600">
                Create your account as a player or court owner in under 2 minutes
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Browse or List</h3>
              <p className="text-gray-600">
                Find available courts or list your court with photos and pricing
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Book & Play</h3>
              <p className="text-gray-600">
                Instant confirmation and payment - show up and play!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              🏆 Trusted by Tbilisi's Premier Tennis Courts
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're already working with the main courts in Vake and Mziuri - the best tennis destinations in Tbilisi!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="text-center">
                <div className="text-4xl mb-4">🎾</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Vake Tennis Complex</h3>
                <p className="text-gray-600 mb-4">
                  "Players love the instant booking system. No more phone chaos - bookings increased 70%!"
                </p>
                <div className="flex justify-center items-center space-x-2">
                  <div className="flex text-yellow-400">
                    ⭐⭐⭐⭐⭐
                  </div>
                  <span className="text-gray-600 font-medium">Premier Vake Location</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="text-center">
                <div className="text-4xl mb-4">🏟️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Mziuri Sports Complex</h3>
                <p className="text-gray-600 mb-4">
                  "Finally, a reliable booking system! Our courts are full and players are happy."
                </p>
                <div className="flex justify-center items-center space-x-2">
                  <div className="flex text-yellow-400">
                    ⭐⭐⭐⭐⭐
                  </div>
                  <span className="text-gray-600 font-medium">Top Mziuri Facility</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🚀 The Numbers Speak for Themselves
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">40+</div>
              <div className="text-gray-600">Tennis Courts in Tbilisi</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">Instant Booking</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">0%</div>
              <div className="text-gray-600">Commission for Players</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">FREE</div>
              <div className="text-gray-600">Your First Game</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            🎾 Ready to Play Tennis the Modern Way in Tbilisi?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join 40+ courts and hundreds of players who've ditched phone booking forever! Your first game is completely FREE! 🆓
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register?role=CUSTOMER"
              className="bg-yellow-400 text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors shadow-lg transform hover:scale-105"
            >
              🎾 BOOK YOUR FREE GAME NOW!
            </Link>
            <Link
              href="/auth/register?role=COURT_OWNER"
              className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors border-2 border-white"
            >
              💰 List Your Court - No Commission!
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">🎾 Tennis Courts Tbilisi</h3>
              <p className="text-gray-400">
                Making tennis fun, instant, and accessible for everyone in beautiful Tbilisi! 🇬🇪
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/" className="text-gray-400 hover:text-white block">Browse Courts</Link>
                <Link href="/auth/login" className="text-gray-400 hover:text-white block">Login</Link>
                <Link href="/auth/register" className="text-gray-400 hover:text-white block">Sign Up</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <div className="text-gray-400">
                <p>Email: info@tenniscourtstbilisi.com</p>
                <p>Phone: +995 XXX XXX XXX</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Tennis Courts Tbilisi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}