import "dotenv/config";

import connectDB from "./config/db.js";
import Registration from "./models/Registration.js";
import "./models/Run.js";
import { sendConfirmationEmail } from "./utils/sendEmail.js";


await connectDB();

console.log("✅ Connected to MongoDB");

const registrations = await Registration.find({
  paymentStatus: "Paid",
  $or: [
    { emailSent: false },
    { emailSent: { $exists: false } },
  ],
}).populate("run");
console.log(`Found ${registrations.length} pending email(s)`);

for (const registration of registrations) {
  try {
    

    await sendConfirmationEmail(
      registration.email,
      registration.name,
      registration.run
    );

    registration.emailSent = true;
    await registration.save();

    console.log(`✅ Email sent to ${registration.email}`);
  } catch (err) {
    console.error(`❌ Failed for ${registration.email}`);
    console.error(err.message);
  }
}

console.log("🎉 Done!");
process.exit();