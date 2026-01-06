import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

/**
 * POST /feedback
 */
router.post("/", async (req, res) => {
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
      from: `"TIE DAO Feedback" <${process.env.EMAIL_USER}>`,
      to: process.env.FEEDBACK_EMAIL || process.env.RECEIVE_EMAIL2, // Separate feedback email if set
      subject: `New Feedback Submission`,
      text: `From: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif">
          <h2>New Feedback Message</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });

    res.status(200).json({ message: "Feedback sent successfully ✅" });
  } catch (error) {
    console.error("Feedback send error:", error);
    res.status(500).json({ message: "Failed to send feedback ❌" });
  }
});

export default router;