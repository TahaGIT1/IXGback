import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4,           // force IPv4
  connectionTimeout: 10000,  // fail fast if it can't connect
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export async function sendConfirmationEmail(email, name, run) {
  console.log("📧 sendConfirmationEmail() started");

  const mailOptions = {
    from: `"IXG Run Club" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🎉 Registration Confirmed",
    html: `
      <h2>Hello ${name} 👋</h2>

      <p>Your registration has been confirmed.</p>

      <p><b>Date:</b> ${run.date}</p>
      <p><b>Time:</b> ${run.time}</p>
      <p><b>Location:</b> ${run.location}</p>
      <p><b>Distance:</b> ${run.distance}</p>

      <h3>See you Sunday! 🏃</h3>
    `,
  };

  console.log("📧 About to call transporter.sendMail()");

  const info = await transporter.sendMail(mailOptions);

  console.log("📧 transporter.sendMail() finished");
  console.log(info.messageId);

  return info;
}

export async function sendOwnerNotification(order) {
  const info = await transporter.sendMail({
    from: `"IXG Run Club" <${process.env.EMAIL_USER}>`,
    to: process.env.OWNER_EMAIL, // your email

    subject: "🛍️ New Merchandise Order",

    html: `
      <h2>New Order Received</h2>
    
      <p><b>Name:</b> ${order.name}</p>
      <p><b>Email:</b> ${order.email}</p>
      <p><b>Phone:</b> ${order.phone}</p>

      <hr>

      <p><b>Product:</b> ${order.product}</p>
      <p><b>Size:</b> ${order.size}</p>
      <p><b>Amount:</b> ₹${order.amount}</p>

      <hr>

      <p><b>Payment ID:</b> ${order.razorpayPaymentId}</p>
    `,
  });

  console.log("✅ Owner email sent:", info.messageId);
}