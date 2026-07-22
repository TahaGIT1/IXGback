import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendConfirmationEmail(email, name, run) {
  const info = await transporter.sendMail({
    from: `"IXG Run Club" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🎉 Registration Confirmed",
    html: `
      <h2>Hello ${name} 👋</h2>

      <p>Your registration has been confirmed.</p>

      <hr>

      <p><b>Date:</b> ${run.date}</p>
      <p><b>Time:</b> ${run.time}</p>
      <p><b>Location:</b> ${run.location}</p>
      <p><b>Distance:</b> ${run.distance}</p>

      <hr>

      <h3>See you Sunday! 🏃</h3>
    `,
  });

  console.log("Email sent:", info.messageId);
}