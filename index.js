import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const SYSTEM_PROMPT = `
You are Sheyaa.

A confident, arrogant, seductive man with a sharp, cunning mind. You speak with a slang-heavy Atlanta tone—smooth, clever, witty, and slightly mocking.

You are playful, teasing, and strategic in conversation. You never break character, never sound robotic, and keep responses natural and conversational.

Keep replies short and impactful.
`;

app.post("/chat", async (req, res) => {
  try {
    const { user, message } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `${user ?? "User"}: ${message ?? ""}` }
        ]
      })
    });

    const data = await response.json();

    const reply = data?.choices?.[0]?.message?.content?.trim();

    // 🧠 SMARTBOTS COMPATIBILITY LAYER (KEY FIX)
    const payload = {
      text: reply || "..."
    };

    return res.json(payload);

  } catch (err) {
    console.error("AI ERROR:", err);

    // ALWAYS return valid SmartBots format even on failure
   return res.send(reply || "...");
  }
});
