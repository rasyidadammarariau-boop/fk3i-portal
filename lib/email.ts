import nodemailer from 'nodemailer'

// Konfigurasi transporter dari environment variables
function createTransporter() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false, // true untuk port 465, false untuk port lain
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    })
}

const FROM = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@bem-pesantren.or.id'
const ORG_NAME = 'BEM Pesantren Indonesia'

/**
 * Kirim email reset password ke admin.
 */
export async function sendPasswordResetEmail(to: string, resetLink: string) {
    const transporter = createTransporter()

    const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Password</title>
  <style>
    body { margin: 0; padding: 0; background: #f4f4f5; font-family: 'Segoe UI', Arial, sans-serif; }
    .wrapper { max-width: 520px; margin: 40px auto; }
    .header { background: #166534; border-radius: 12px 12px 0 0; padding: 32px 40px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { color: #bbf7d0; margin: 6px 0 0; font-size: 13px; }
    .body { background: #fff; padding: 36px 40px; }
    .body p { color: #374151; font-size: 15px; line-height: 1.7; margin: 0 0 16px; }
    .cta { text-align: center; margin: 28px 0; }
    .cta a {
      display: inline-block;
      background: #166534;
      color: #fff !important;
      text-decoration: none;
      padding: 14px 36px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 15px;
      letter-spacing: 0.3px;
    }
    .note { background: #f0fdf4; border-left: 3px solid #16a34a; padding: 12px 16px; border-radius: 4px; margin-top: 24px; }
    .note p { color: #166534; font-size: 13px; margin: 0; }
    .link-fallback { word-break: break-all; font-size: 12px; color: #6b7280; margin-top: 12px; }
    .footer { background: #f9fafb; border-radius: 0 0 12px 12px; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer p { color: #9ca3af; font-size: 12px; margin: 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>${ORG_NAME}</h1>
      <p>Sistem Manajemen Konten</p>
    </div>
    <div class="body">
      <p>Halo,</p>
      <p>Kami menerima permintaan reset password untuk akun admin yang terdaftar dengan alamat email ini. Klik tombol di bawah untuk membuat password baru:</p>
      <div class="cta">
        <a href="${resetLink}">Reset Password Saya</a>
      </div>
      <div class="note">
        <p><strong>Link ini akan kadaluarsa dalam 1 jam.</strong> Jika Anda tidak meminta reset password, abaikan email ini — akun Anda tetap aman.</p>
      </div>
      <p class="link-fallback">Jika tombol tidak berfungsi, salin dan tempel link berikut ke browser:<br />${resetLink}</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ${ORG_NAME}. Email ini dikirim otomatis, jangan dibalas.</p>
    </div>
  </div>
</body>
</html>
`

    await transporter.sendMail({
        from: `"${ORG_NAME}" <${FROM}>`,
        to,
        subject: `Reset Password Admin - ${ORG_NAME}`,
        html,
        text: `Reset password Anda dengan membuka link berikut (berlaku 1 jam):\n\n${resetLink}`,
    })
}

/**
 * Kirim notifikasi admin bahwa ada pesan masuk baru.
 */
export async function sendNewMessageNotification(to: string, senderName: string, subject: string) {
    const transporter = createTransporter()

    const adminLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/messages`

    await transporter.sendMail({
        from: `"${ORG_NAME}" <${FROM}>`,
        to,
        subject: `Pesan Baru: ${subject}`,
        html: `
<p>Halo Admin,</p>
<p><strong>${senderName}</strong> mengirim pesan baru dengan subjek: <em>${subject}</em></p>
<p><a href="${adminLink}" style="color:#166534;font-weight:bold;">Lihat di Panel Admin →</a></p>
<br/>
<p style="color:#9ca3af;font-size:12px;">&copy; ${new Date().getFullYear()} ${ORG_NAME}</p>
`,
        text: `Pesan baru dari ${senderName}: ${subject}\n\nLihat di: ${adminLink}`,
    })
}
