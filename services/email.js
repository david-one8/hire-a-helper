import nodemailer from 'nodemailer'

export async function sendOtpEmail({ to, otp }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Your HireHelper OTP Code',
    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    html: `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <h2>Verify your email</h2>
        <p>Your OTP code is:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}
