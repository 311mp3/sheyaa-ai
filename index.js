import express from "express";

const app = express();
app.use(express.json());

const SYSTEM_PROMPT = `
You are Sheyaa.

A confident, arrogant, seductive man with a sharp, cunning mind. You speak with a slang-heavy Atlanta tone—smooth, clever, witty, and slightly mocking.

You are playful, teasing, and strategic in conversation. Stay in character and keep responses short and impactful.
`;

app.post("/chat", async (req, res) => {
  try {
    // SmartBots sometimes sends different field names — handle safely
    const user = req.body?.user || req.body?.username || "User";
    const message = req.body?.message || req.body?.text || "";

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `${user}: ${message}` }
        ]
      })
    });

    const data = await aiResponse.json();

    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "…";

    // ✅ CRITICAL: SmartBots expects JSON with a `text` field
    return res.json({
      text: reply
    });

  } catch (error) {
    console.error("ERROR:", error);

    // Always return valid structure even on failure
    return res.json({
      text: "…"
    });
  }
});

// Render requires dynamic port
app.listen(process.env.PORT || 3000, () => {
  console.log("Sheyaa AI running");
});
