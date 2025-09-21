// Demo script to show signed-in experience
const BASE_URL = 'http://localhost:3000/api'

async function demonstrateSignIn() {
  console.log('🎯 Demonstrating Sign-In Experience...\n')

  try {
    // Generate unique email for demo
    const timestamp = Date.now()
    const demoEmail = `demo${timestamp}@example.com`

    console.log('1. 🏸 Registering as a Court Owner...')
    const ownerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Demo Court Owner',
        email: demoEmail,
        password: 'demo123',
        phone: '+995555999888',
        role: 'COURT_OWNER'
      })
    })

    if (ownerResponse.ok) {
      const ownerData = await ownerResponse.json()
      console.log('✅ Successfully registered!')
      console.log(`📧 Email: ${ownerData.user.email}`)
      console.log(`🔑 Token: ${ownerData.token.substring(0, 20)}...`)
      console.log(`👤 Role: ${ownerData.user.role}`)

      console.log('\n2. 🎾 Creating a demo court...')
      const courtResponse = await fetch(`${BASE_URL}/courts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ownerData.token}`
        },
        body: JSON.stringify({
          name: 'Demo Tennis Academy',
          address: 'Demo Street 123, Tbilisi',
          description: 'Premium indoor court with professional lighting',
          hourlyRate: 4000, // 40 GEL in tetri
          indoor: true
        })
      })

      if (courtResponse.ok) {
        const courtData = await courtResponse.json()
        console.log('✅ Court created successfully!')
        console.log(`🏟️  Court: ${courtData.name}`)
        console.log(`📍 Address: ${courtData.address}`)
        console.log(`💰 Price: ${(courtData.hourlyRate / 100).toFixed(2)} ₾/hour`)

        console.log('\n3. ⏰ Generating availability slots...')
        const today = new Date().toISOString().split('T')[0]
        const slotsResponse = await fetch(`${BASE_URL}/courts/${courtData.id}/slots`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ownerData.token}`
          },
          body: JSON.stringify({
            date: today,
            startHour: 8,
            endHour: 20
          })
        })

        if (slotsResponse.ok) {
          const slotsData = await slotsResponse.json()
          console.log('✅ Slots generated successfully!')
          console.log(`📅 Date: ${today}`)
          console.log(`⏱️  ${slotsData.message}`)

          console.log('\n🎉 DEMO SETUP COMPLETE!')
          console.log('\n📋 What you can now do:')
          console.log('┌─────────────────────────────────────────────────────┐')
          console.log('│  🌐 OPEN: http://localhost:3000                    │')
          console.log('├─────────────────────────────────────────────────────┤')
          console.log('│  🔐 LOGIN WITH:                                    │')
          console.log(`│     Email: ${demoEmail}      │`)
          console.log('│     Password: demo123                               │')
          console.log('├─────────────────────────────────────────────────────┤')
          console.log('│  👤 AS COURT OWNER YOU CAN:                        │')
          console.log('│     • View your dashboard                           │')
          console.log('│     • Manage your courts                            │')
          console.log('│     • See bookings and revenue                      │')
          console.log('│     • Generate more time slots                      │')
          console.log('├─────────────────────────────────────────────────────┤')
          console.log('│  🎯 AFTER LOGIN YOU WILL SEE:                      │')
          console.log('│     • "Dashboard" button instead of Login/Register │')
          console.log('│     • Your court listed on the homepage            │')
          console.log('│     • Full court management interface               │')
          console.log('└─────────────────────────────────────────────────────┘')

          console.log('\n🔄 OR CREATE A CUSTOMER ACCOUNT TO:')
          console.log('   • Browse and book courts')
          console.log('   • See booking confirmations')
          console.log('   • View booking history')

        } else {
          console.log('❌ Failed to generate slots')
        }
      } else {
        console.log('❌ Failed to create court')
      }
    } else {
      const error = await ownerResponse.json()
      console.log('❌ Registration failed:', error.error)
    }

  } catch (error) {
    console.error('❌ Demo failed:', error.message)
  }
}

demonstrateSignIn()