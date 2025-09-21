// Debug script to check login status
const BASE_URL = 'http://localhost:3000/api'

async function debugLogin() {
  console.log('🔍 Debugging Login Status...')

  try {
    // Use the most recent demo account
    const demoEmail = 'demo1758463448687@example.com'

    console.log('1. 🔐 Attempting login...')
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: demoEmail,
        password: 'demo123'
      })
    })

    if (loginResponse.ok) {
      const loginData = await loginResponse.json()
      console.log('✅ Login successful!')
      console.log('📧 User:', loginData.user.name, `(${loginData.user.email})`)
      console.log('👤 Role:', loginData.user.role)
      console.log('🔑 Token exists:', !!loginData.token)

      console.log('\n📋 For browser debugging:')
      console.log('1. Open http://localhost:3000')
      console.log('2. Press F12 → Console tab')
      console.log('3. Run these commands to simulate login:')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log(`localStorage.setItem('token', '${loginData.token}');`)
      console.log(`localStorage.setItem('user', '${JSON.stringify(loginData.user)}');`)
      console.log('location.reload();')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

      console.log('\n🔍 OR just login normally with:')
      console.log(`📧 Email: ${demoEmail}`)
      console.log('🔒 Password: demo123')

    } else {
      const error = await loginResponse.json()
      console.log('❌ Login failed:', error.error)
    }

  } catch (error) {
    console.error('❌ Debug failed:', error.message)
  }
}

debugLogin()