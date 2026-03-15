const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || 'InstaHire <onboarding@resend.dev>';

// Verify on startup
if (!process.env.RESEND_API_KEY) {
  console.warn('⚠️  RESEND_API_KEY not set — emails will fail');
} else {
  console.log('✅ Resend email service ready');
}

async function sendMail({ to, subject, html, text }) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
      text
    });
    if (error) throw new Error(error.message);
    console.log(`📧 Email sent to ${to}: ${data.id}`);
    return data;
  } catch (err) {
    console.error('❌ Email send failed:', err.message);
    throw err;
  }
}

exports.sendOTPEmail = async (email, otp) => {
  return sendMail({
    to: email,
    subject: 'InstaHire — Verify Your Email',
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#2563eb,#9333ea);padding:30px;text-align:center;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0">InstaHire</h1>
        </div>
        <div style="background:#f8fafc;padding:40px;border-radius:0 0 12px 12px">
          <h2 style="color:#1e293b">Verify Your Email</h2>
          <p style="color:#64748b">Use the OTP below. It expires in 10 minutes.</p>
          <div style="background:white;border:2px dashed #2563eb;border-radius:12px;padding:20px;text-align:center;margin:24px 0">
            <span style="font-size:36px;font-weight:bold;color:#2563eb;letter-spacing:8px">${otp}</span>
          </div>
          <p style="color:#94a3b8;font-size:13px">If you did not request this, please ignore this email.</p>
        </div>
      </div>`
  });
};

exports.sendWelcomeEmail = async (email, name) => {
  return sendMail({
    to: email,
    subject: 'Welcome to InstaHire 🎉',
    text: `Welcome ${name}! Start exploring jobs.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#2563eb,#9333ea);padding:30px;text-align:center;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0">Welcome to InstaHire!</h1>
        </div>
        <div style="background:#f8fafc;padding:40px;border-radius:0 0 12px 12px">
          <h2 style="color:#1e293b">Hi ${name} 👋</h2>
          <p style="color:#64748b">Your account is ready. Start exploring jobs!</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/jobs"
            style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:16px">
            Browse Jobs
          </a>
        </div>
      </div>`
  });
};

exports.sendApplicationEmail = async (email, jobTitle) => {
  return sendMail({
    to: email,
    subject: `Application Submitted — ${jobTitle}`,
    text: `Your application for ${jobTitle} has been submitted.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#2563eb,#9333ea);padding:30px;text-align:center;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0">Application Submitted!</h1>
        </div>
        <div style="background:#f8fafc;padding:40px;border-radius:0 0 12px 12px">
          <h2 style="color:#1e293b">You applied for ${jobTitle} ✅</h2>
          <p style="color:#64748b">Your application has been submitted successfully.</p>
        </div>
      </div>`
  });
};

exports.sendInterviewInvite = async (email, details) => {
  return sendMail({
    to: email,
    subject: 'Interview Scheduled — InstaHire 📅',
    text: `Your interview is scheduled at ${details.scheduledAt}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#7c3aed,#2563eb);padding:30px;text-align:center;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0">Interview Scheduled 📅</h1>
        </div>
        <div style="background:#f8fafc;padding:40px;border-radius:0 0 12px 12px">
          <p style="color:#64748b"><strong>Date & Time:</strong> ${new Date(details.scheduledAt).toLocaleString()}</p>
          <p style="color:#64748b"><strong>Type:</strong> ${details.type || 'In-person'}</p>
          ${details.notes ? `<p style="color:#64748b"><strong>Notes:</strong> ${details.notes}</p>` : ''}
        </div>
      </div>`
  });
};

exports.sendStatusUpdate = async (email, jobTitle, status) => {
  const map = {
    shortlisted: { emoji: '⭐', text: 'You have been shortlisted!', color: '#f59e0b' },
    hired:       { emoji: '🎉', text: 'Congratulations! You are hired!', color: '#10b981' },
    rejected:    { emoji: '❌', text: 'Your application was not selected.', color: '#ef4444' }
  };
  const s = map[status] || { emoji: '📋', text: `Status updated to ${status}`, color: '#2563eb' };
  return sendMail({
    to: email,
    subject: `Application Update — ${jobTitle}`,
    text: `Your application for ${jobTitle} is now: ${status}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:${s.color};padding:30px;text-align:center;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0">${s.emoji} ${s.text}</h1>
        </div>
        <div style="background:#f8fafc;padding:40px;border-radius:0 0 12px 12px">
          <h2 style="color:#1e293b">Update for ${jobTitle}</h2>
          <p style="color:#64748b">${s.text}</p>
        </div>
      </div>`
  });
};
