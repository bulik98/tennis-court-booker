// Fresh test script for MVP functionality
const BASE_URL = 'http://localhost:3000/api'

// Generate unique emails for each test run
const timestamp = Date.now()
const ownerEmail = `owner${timestamp}@example.com`
const customerEmail = `customer${timestamp}@example.com`

async function testMVP() {
  console.log('🚀 Starting Fresh MVP Test...\n')

  try {
    // 1. Test user registration (court owner)
    console.log('1. Testing court owner registration...')
    const ownerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Giorgi Tennisidze',
        email: ownerEmail,
        password: 'password123',
        phone: '+995555123456',
        role: 'COURT_OWNER'
      })
    })

    if (ownerResponse.ok) {
      const ownerData = await ownerResponse.json()
      console.log('✅ Court owner registered successfully')

      // 2. Test court creation
      console.log('\n2. Testing court creation...')
      const courtResponse = await fetch(`${BASE_URL}/courts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ownerData.token}`
        },
        body: JSON.stringify({
          name: 'Central Tennis Club',
          address: 'Rustaveli Avenue 25, Tbilisi',
          description: 'Professional outdoor tennis court with lighting',
          hourlyRate: 3000, // 30 GEL in tetri
          indoor: false
        })
      })

      if (courtResponse.ok) {
        const courtData = await courtResponse.json()
        console.log('✅ Court created successfully')

        // 3. Test time slot generation
        console.log('\n3. Testing time slot generation...')
        const today = new Date().toISOString().split('T')[0]
        const slotsResponse = await fetch(`${BASE_URL}/courts/${courtData.id}/slots`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ownerData.token}`
          },
          body: JSON.stringify({
            date: today,
            startHour: 9,
            endHour: 18
          })
        })

        if (slotsResponse.ok) {
          const slotsData = await slotsResponse.json()
          console.log('✅ Time slots generated successfully:', slotsData.message)

          // 4. Test customer registration
          console.log('\n4. Testing customer registration...')
          const customerResponse = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Ana Customeridze',
              email: customerEmail,
              password: 'password123',
              phone: '+995555654321',
              role: 'CUSTOMER'
            })
          })

          if (customerResponse.ok) {
            const customerData = await customerResponse.json()
            console.log('✅ Customer registered successfully')

            // 5. Test court listing
            console.log('\n5. Testing court listing...')
            const courtsResponse = await fetch(`${BASE_URL}/courts`)

            if (courtsResponse.ok) {
              const courts = await courtsResponse.json()
              console.log('✅ Courts listed successfully, found', courts.length, 'courts')

              // 6. Test court details
              console.log('\n6. Testing court details...')
              const courtDetailResponse = await fetch(`${BASE_URL}/courts/${courtData.id}`)

              if (courtDetailResponse.ok) {
                const courtDetail = await courtDetailResponse.json()
                console.log('✅ Court details retrieved successfully')
                console.log(`   Found ${courtDetail.slots.length} total slots`)

                // Filter for today's available slots
                const todaySlots = courtDetail.slots.filter(slot => {
                  const slotDate = slot.date.split('T')[0]
                  return slotDate === today && !slot.isBooked
                })

                console.log(`   Found ${todaySlots.length} available slots for today`)

                if (todaySlots.length > 0) {
                  // 7. Test booking creation
                  console.log('\n7. Testing booking creation...')
                  const availableSlot = todaySlots[0]
                  console.log(`   Booking slot: ${availableSlot.startTime}-${availableSlot.endTime}`)

                  const bookingResponse = await fetch(`${BASE_URL}/bookings`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${customerData.token}`
                    },
                    body: JSON.stringify({
                      slotId: availableSlot.id,
                      courtId: courtData.id
                    })
                  })

                  if (bookingResponse.ok) {
                    const bookingData = await bookingResponse.json()
                    console.log('✅ Booking created successfully')

                    // 8. Test owner's court bookings
                    console.log('\n8. Testing owner booking view...')
                    const ownerBookingsResponse = await fetch(`${BASE_URL}/courts/${courtData.id}/bookings`, {
                      headers: {
                        'Authorization': `Bearer ${ownerData.token}`
                      }
                    })

                    if (ownerBookingsResponse.ok) {
                      const ownerBookings = await ownerBookingsResponse.json()
                      console.log('✅ Owner can view bookings, found', ownerBookings.length, 'bookings')

                      console.log('\n🎉 ALL TESTS PASSED! MVP is working correctly.')
                      console.log('\n📊 Test Summary:')
                      console.log(`- Court Owner: ${ownerData.user.name} (${ownerData.user.email})`)
                      console.log(`- Customer: ${customerData.user.name} (${customerData.user.email})`)
                      console.log(`- Court: ${courtData.name}`)
                      console.log(`- Booking: ${bookingData.date.split('T')[0]} ${bookingData.startTime}-${bookingData.endTime}`)
                      console.log(`- Total Amount: ${(bookingData.totalAmount / 100).toFixed(2)} ₾`)
                      console.log(`- Commission: ${(bookingData.commission / 100).toFixed(2)} ₾`)
                      console.log(`- Platform Revenue: ${(bookingData.commission / 100).toFixed(2)} ₾ (4%)`)
                      console.log(`- Court Owner Revenue: ${((bookingData.totalAmount - bookingData.commission) / 100).toFixed(2)} ₾ (96%)`)

                      console.log('\n🌐 You can now open http://localhost:3000 in your browser to see the full application!')
                    } else {
                      console.log('❌ Failed to fetch owner bookings')
                    }
                  } else {
                    const error = await bookingResponse.json()
                    console.log('❌ Failed to create booking:', error.error)
                  }
                } else {
                  console.log('❌ No available slots found for today')
                }
              } else {
                console.log('❌ Failed to get court details')
              }
            } else {
              console.log('❌ Failed to list courts')
            }
          } else {
            const error = await customerResponse.json()
            console.log('❌ Failed to register customer:', error.error)
          }
        } else {
          const error = await slotsResponse.json()
          console.log('❌ Failed to generate time slots:', error.error)
        }
      } else {
        const error = await courtResponse.json()
        console.log('❌ Failed to create court:', error.error)
      }
    } else {
      const error = await ownerResponse.json()
      console.log('❌ Failed to register court owner:', error.error)
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message)
  }
}

testMVP()