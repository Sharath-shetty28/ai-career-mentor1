import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// === POST /generate ===
app.post("/generate", async (req, res) => {
  const { userInput } = req.body;

  const body = {
    system_instruction: {
      parts: [
        {
          text: "You are a professional tech career mentor helping students with resume building, interview preparation, and job search advice. Give short, clear, and motivational answers like a helpful mentor.",
        },
      ],
    },
    contents: [{ parts: [{ text: userInput }] }],
  };

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    function beautifyReply(text) {
      return text
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Bold markdown
        .replace(/\n/g, "<br/>"); // Line breaks
    }

    const data = await geminiRes.json();
    const rawReply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I didn't get that.";

    const reply = beautifyReply(rawReply);
    res.json({ reply });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
