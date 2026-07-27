import "dotenv/config";
import { sendConfirmationEmail } from "./utils/sendEmail.js";

await sendConfirmationEmail(
  "YOUR_PERSONAL_EMAIL@gmail.com",
  "Taha",
  {
    date: "Sunday",
    time: "7 AM",
    location: "Vaccine Depot",
    distance: "4 KM",
  }
);

