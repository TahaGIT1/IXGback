import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
  const { password } = req.body;

  console.log("Password entered:", password);
  console.log("ADMIN_PASSWORD exists:", !!process.env.ADMIN_PASSWORD);
  console.log("Passwords match:", password === process.env.ADMIN_PASSWORD);

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      message: "Invalid password",
    });
  }

  // rest of your code...


  const token = jwt.sign(
    {
      role: "admin",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
  });
};

export const verifyAdmin = (req, res) => {
  res.status(200).json({
    success: true,
    admin: req.admin,
  });
};