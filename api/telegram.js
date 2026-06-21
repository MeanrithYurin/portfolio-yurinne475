export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      message: "Method not allowed",
    });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      ok: false,
      message: "Please fill in all fields.",
    });
  }

  const text = `
New message from portfolio website

Name: ${name}
Email: ${email}

Message:
${message}
`;

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: text,
        }),
      }
    );

    if (!telegramResponse.ok) {
      return res.status(500).json({
        ok: false,
        message: "Telegram failed to send message.",
      });
    }6

    return res.status(200).json({
      ok: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Server error. Please try again later.",
    });
  }
}