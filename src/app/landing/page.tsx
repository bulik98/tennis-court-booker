'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Landing() {
  const [activeTab, setActiveTab] = useState<'players' | 'owners'>('players')

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">
              Tennis Courts
              <span className="block text-emerald-300">Tbilisi</span>
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              End the frustration of phone booking. Instant bookings, guaranteed reservations, professional courts.
            </p>
            <div className="bg-gradient-to-r from-emerald-400 to-teal-400 text-emerald-900 px-8 py-4 rounded-lg font-bold text-lg mb-12 inline-block shadow-xl">
              YOUR FIRST GAME IS FREE
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/auth/register?role=CUSTOMER"
                className="bg-white text-emerald-900 px-10 py-5 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                Book Your Court Now
              </Link>
              <Link
                href="/auth/register?role=COURT_OWNER"
                className="bg-transparent text-white px-10 py-5 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 border-2 border-white/50 hover:border-white"
              >
                List Your Court
              </Link>
            </div>
          </div>
        </div>
        {/* Geometric decoration */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-emerald-400/10 rounded-full"></div>
        <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-teal-400/20 rotate-45 rounded-lg"></div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">
              No More Phone Tag for Tennis Courts
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Tired of endless calls? Fed up with uncertain reservations that disappear by tomorrow?
              We&apos;ve solved Tbilisi&apos;s tennis booking nightmare with 40+ professional courts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-white shadow-lg border border-slate-100">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Endless Phone Calls</h3>
              <p className="text-slate-600 leading-relaxed">
                Calling 10+ courts, waiting on hold, getting busy signals, and still no court available.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-white shadow-lg border border-slate-100">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Lost Reservations</h3>
              <p className="text-slate-600 leading-relaxed">
                Your booking mysteriously disappears by tomorrow - no guarantee you&apos;ll actually play.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-white shadow-lg border border-slate-100">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Endless Waiting</h3>
              <p className="text-slate-600 leading-relaxed">
                Long wait times just to hear &ldquo;maybe tomorrow&rdquo; - spending more time booking than playing!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Tabs */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">
              Built for Players & Court Owners
            </h2>
            <div className="flex justify-center mb-12">
              <div className="bg-slate-100 p-2 rounded-xl">
                <button
                  onClick={() => setActiveTab('players')}
                  className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
                    activeTab === 'players'
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  For Tennis Players
                </button>
                <button
                  onClick={() => setActiveTab('owners')}
                  className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
                    activeTab === 'owners'
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
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
                <h3 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">
                  Book Courts in Seconds, Not Hours
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Instant Booking</h4>
                      <p className="text-slate-600 leading-relaxed">Book courts in seconds, not hours - across 40+ courts in Tbilisi!</p>
                    </div>
                  </div>
                  <div className="flex items-start p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Zero Commission</h4>
                      <p className="text-slate-600 leading-relaxed">Secure instant payment - no hidden fees for players!</p>
                    </div>
                  </div>
                  <div className="flex items-start p-4 rounded-xl bg-teal-50 border border-teal-100">
                    <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
                        <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Your First Game is FREE</h4>
                      <p className="text-slate-600 leading-relaxed">Try any court in our network completely free - no risk!</p>
                    </div>
                  </div>
                  <div className="flex items-start p-4 rounded-xl bg-purple-50 border border-purple-100">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Guaranteed Reservations</h4>
                      <p className="text-slate-600 leading-relaxed">Your booking WON&apos;T disappear - stable, reliable reservations</p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/auth/register?role=CUSTOMER"
                  className="inline-block mt-8 bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  Book Your First Game FREE
                </Link>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex text-yellow-400">
                    ★★★★★
                  </div>
                </div>
                <blockquote className="text-lg text-slate-700 mb-6 italic leading-relaxed">
                  &ldquo;No more calling 15 courts every morning! Now I book in 30 seconds and actually PLAY tennis!&rdquo;
                </blockquote>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-emerald-800 font-bold text-sm">GM</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Giorgi M.</p>
                    <p className="text-sm text-slate-600">Vake Tennis Player</p>
                  </div>
                </div>
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
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex text-yellow-400">
                    ★★★★★
                  </div>
                </div>
                <blockquote className="text-lg text-slate-700 mb-6 italic leading-relaxed">
                  &ldquo;Finally no more phone bookings! My revenue increased 60% and I keep 100% - amazing!&rdquo;
                </blockquote>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-800 font-bold text-sm">NK</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Nino K.</p>
                    <p className="text-sm text-slate-600">Premier Court Owner in Vake</p>
                  </div>
                </div>
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
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">
              Trusted by Tbilisi&apos;s Premier Tennis Courts
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We&apos;re already working with the main courts in Vake and Mziuri - the best tennis destinations in Tbilisi!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-10 shadow-xl border border-slate-100">
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Vake Tennis Complex</h3>
                <blockquote className="text-lg text-slate-600 mb-6 italic leading-relaxed">
                  &ldquo;Players love the instant booking system. No more phone chaos - bookings increased 70%!&rdquo;
                </blockquote>
                <div className="flex justify-center items-center space-x-3">
                  <div className="flex text-yellow-400 text-lg">
                    ★★★★★
                  </div>
                  <span className="text-slate-500 font-medium">Premier Vake Location</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-10 shadow-xl border border-slate-100">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Mziuri Sports Complex</h3>
                <blockquote className="text-lg text-slate-600 mb-6 italic leading-relaxed">
                  &ldquo;Finally, a reliable booking system! Our courts are full and players are happy.&rdquo;
                </blockquote>
                <div className="flex justify-center items-center space-x-3">
                  <div className="flex text-yellow-400 text-lg">
                    ★★★★★
                  </div>
                  <span className="text-slate-500 font-medium">Top Mziuri Facility</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-emerald-900 to-teal-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              The Numbers Speak for Themselves
            </h2>
          </div>
          <div className="relative grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-black text-emerald-300 mb-4">40+</div>
              <div className="text-emerald-100 font-medium">Tennis Courts in Tbilisi</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-black text-teal-300 mb-4">24/7</div>
              <div className="text-teal-100 font-medium">Instant Booking</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-black text-emerald-300 mb-4">0%</div>
              <div className="text-emerald-100 font-medium">Commission for Players</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-black text-teal-300 mb-4">FREE</div>
              <div className="text-teal-100 font-medium">Your First Game</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-slate-900 to-slate-800 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 to-transparent"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
            Ready to Play Tennis the Modern Way?
          </h2>
          <p className="text-xl text-slate-300 mb-12 leading-relaxed">
            Join 40+ courts and hundreds of players who&apos;ve ditched phone booking forever. Your first game is completely FREE.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/auth/register?role=CUSTOMER"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-12 py-5 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
            >
              BOOK YOUR FREE GAME NOW
            </Link>
            <Link
              href="/auth/register?role=COURT_OWNER"
              className="bg-transparent text-white px-12 py-5 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 border-2 border-white/50 hover:border-white"
            >
              List Your Court - No Commission
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white text-xl font-bold mb-4">Tennis Courts Tbilisi</h3>
              <p className="text-slate-400 leading-relaxed">
                Making tennis accessible and convenient for everyone in beautiful Tbilisi.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/" className="text-slate-400 hover:text-emerald-400 transition-colors block">Browse Courts</Link>
                <Link href="/auth/login" className="text-slate-400 hover:text-emerald-400 transition-colors block">Login</Link>
                <Link href="/auth/register" className="text-slate-400 hover:text-emerald-400 transition-colors block">Sign Up</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <div className="text-slate-400 space-y-2">
                <p>Email: info@tenniscourtstbilisi.com</p>
                <p>Phone: +995 XXX XXX XXX</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Tennis Courts Tbilisi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}