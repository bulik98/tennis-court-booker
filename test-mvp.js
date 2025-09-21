// Test script for MVP functionality
const BASE_URL = 'http://localhost:3000/api'

async function testMVP() {
  console.log('🚀 Starting MVP Test...\n')

  try {
    // 1. Test user registration (court owner)
    console.log('1. Testing court owner registration...')
    const ownerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Giorgi Tennisidze',
        email: 'owner@example.com',
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
          console.log('✅ Time slots generated successfully')

          // 4. Test customer registration
          console.log('\n4. Testing customer registration...')
          const customerResponse = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Ana Customeridze',
              email: 'customer@example.com',
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
              console.log('✅ Courts listed successfully')

              // 6. Test court details
              console.log('\n6. Testing court details...')
              const courtDetailResponse = await fetch(`${BASE_URL}/courts/${courtData.id}`)

              if (courtDetailResponse.ok) {
                const courtDetail = await courtDetailResponse.json()
                console.log('✅ Court details retrieved successfully')

                // 7. Test booking creation
                console.log('\n7. Testing booking creation...')
                const availableSlot = courtDetail.slots.find(slot => !slot.isBooked)

                if (availableSlot) {
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
                      console.log('✅ Owner can view bookings')

                      console.log('\n🎉 ALL TESTS PASSED! MVP is working correctly.')
                      console.log('\n📊 Test Summary:')
                      console.log(`- Court Owner: ${ownerData.user.name} (${ownerData.user.email})`)
                      console.log(`- Customer: ${customerData.user.name} (${customerData.user.email})`)
                      console.log(`- Court: ${courtData.name}`)
                      console.log(`- Booking: ${bookingData.date.split('T')[0]} ${bookingData.startTime}-${bookingData.endTime}`)
                      console.log(`- Total Amount: ${(bookingData.totalAmount / 100).toFixed(2)} ₾`)
                      console.log(`- Commission: ${(bookingData.commission / 100).toFixed(2)} ₾`)
                    } else {
                      console.log('❌ Failed to fetch owner bookings')
                    }
                  } else {
                    console.log('❌ Failed to create booking')
                  }
                } else {
                  console.log('❌ No available slots found')
                }
              } else {
                console.log('❌ Failed to get court details')
              }
            } else {
              console.log('❌ Failed to list courts')
            }
          } else {
            console.log('❌ Failed to register customer')
          }
        } else {
          console.log('❌ Failed to generate time slots')
        }
      } else {
        console.log('❌ Failed to create court')
      }
    } else {
      console.log('❌ Failed to register court owner')
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message)
  }
}

testMVP()