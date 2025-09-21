import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export async function sendBookingConfirmation(
  customerEmail: string,
  customerName: string,
  courtName: string,
  date: string,
  startTime: string,
  endTime: string,
  amount: number
) {
  const subject = `Booking Confirmation - ${courtName}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #16a34a;">Booking Confirmed!</h2>

      <p>Dear ${customerName},</p>

      <p>Your tennis court booking has been confirmed. Here are the details:</p>

      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #374151;">Booking Details</h3>
        <p><strong>Court:</strong> ${courtName}</p>
        <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
        <p><strong>Amount:</strong> ${(amount / 100).toFixed(2)} ₾</p>
      </div>

      <p>Please arrive 10 minutes before your booking time.</p>

      <p>If you need to cancel or modify your booking, please contact the court owner.</p>

      <p>Thank you for using Tennis Courts Tbilisi!</p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #6b7280;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  `

  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@tenniscourtstbilisi.com',
      to: customerEmail,
      subject,
      html
    })
    console.log('Booking confirmation email sent to:', customerEmail)
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error)
  }
}

export async function sendBookingNotificationToOwner(
  ownerEmail: string,
  ownerName: string,
  customerName: string,
  customerEmail: string,
  courtName: string,
  date: string,
  startTime: string,
  endTime: string,
  amount: number,
  commission: number
) {
  const subject = `New Booking - ${courtName}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #16a34a;">New Booking Received!</h2>

      <p>Dear ${ownerName},</p>

      <p>You have received a new booking for your court:</p>

      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #374151;">Booking Details</h3>
        <p><strong>Court:</strong> ${courtName}</p>
        <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
        <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
        <p><strong>Total Amount:</strong> ${(amount / 100).toFixed(2)} ₾</p>
        <p><strong>Your Earnings:</strong> ${((amount - commission) / 100).toFixed(2)} ₾</p>
        <p><strong>Platform Commission:</strong> ${(commission / 100).toFixed(2)} ₾</p>
      </div>

      <p>The customer will arrive at the scheduled time. Please ensure the court is ready.</p>

      <p>You can view all your bookings in your dashboard.</p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #6b7280;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  `

  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@tenniscourtstbilisi.com',
      to: ownerEmail,
      subject,
      html
    })
    console.log('Booking notification email sent to owner:', ownerEmail)
  } catch (error) {
    console.error('Failed to send booking notification email:', error)
  }
}