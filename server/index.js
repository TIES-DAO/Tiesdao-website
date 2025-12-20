import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test GET route
app.get("/api/contact", (req, res) => {
  res.json({ message: "Contact API is working!" });
});

// POST route for sending emails
app.post("/api/contact", async (req, res) => {
  const { email, message } = req.body;
  if (!email || !message) return res.status(400).json({ message: "Email and message are required." });

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"TIE DAO Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVE_EMAIL,
      subject: `New Contact Form Submission from ${email}`,
      text: `From: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>From:</strong> ${email}</p><p><strong>Message:</strong><br/>${message}</p>`,
    });

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ message: "Failed to send email." });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
