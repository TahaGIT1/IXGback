import nodemailer from "nodemailer";
console.log("📧 sendEmail.js loaded");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  family: 4, // Force IPv4
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Verify SMTP once when the server starts
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP Connection Failed");
    console.error(error);
  } else {
    console.log("✅ SMTP Connected");
  }
});

export const sendConfirmationEmail = async (email, name, run) => {
  try {
    console.log(`📧 Sending email to ${email}`);

    const mailOptions = {
      from: `"IXG Run Club" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 You're Registered for IXG Run Club!",
      html: `
        <div style="font-family:Arial,sans-serif;padding:30px;max-width:600px;margin:auto">
          <h1 style="color:#f97316">IXG Run Club</h1>

          <h2>Hello ${name}! 👋</h2>

          <p>Your registration has been confirmed.</p>

          <hr>

          <h3>🏃 Run Details</h3>

          <p><strong>Date:</strong> ${run.date}</p>
          <p><strong>Time:</strong> ${run.time}</p>
          <p><strong>Location:</strong> ${run.location}</p>
          <p><strong>Distance:</strong> ${run.distance}</p>

          <hr>

          <p>We're excited to have you join us!</p>

          <h3 style="color:#f97316">
            ☕ Coffee's on us after the run!
          </h3>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email Sent");
    console.log(info.messageId);

    return info;
  } catch (err) {
    console.error("❌ Email Error");
    console.error(err);
    throw err;
  }
};