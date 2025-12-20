import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/**
 * ✅ Test route
 * URL after deploy:
 * https://your-project.vercel.app/
 */
app.get("/", (req, res) => {
  res.json({ message: "TIE DAO Contact API is working 🚀" });
});

/**
 * ✅ Contact form route
 * URL after deploy:
 * https://your-project.vercel.app/contact
 */
app.post("/contact", async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res
      .status(400)
      .json({ message: "Email and message are required." });
  }

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
      html: `
        <div style="font-family: Arial, sans-serif">
          <h2>New Contact Message</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });

    res.status(200).json({ message: "Email sent successfully ✅" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ message: "Failed to send email ❌" });
  }
});

export default app;
