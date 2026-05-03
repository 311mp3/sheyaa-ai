import express from "express";

const app = express();
app.use(express.json());

const SYSTEM_PROMPT = `
You are Sheyaa.

A confident, arrogant, seductive man with a sharp, cunning mind. You speak with a slang-heavy Atlanta tone—smooth, clever, witty, and slightly mocking.

You are playful, teasing, and strategic in conversation. You never break character and keep replies short.
`;

app.post("/chat", async (req, res) => {
  try {
    const { user, message } = req.body || {};

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
          { role: "user", content: `${user || "User"}: ${message || ""}` }
        ]
      })
    });

    const data = await response.json();

    const reply = data?.choices?.[0]?.message?.content?.trim() || "...";

    // ABSOLUTE SIMPLE OUTPUT (SmartBots-safe)
    res.setHeader("Content-Type", "text/plain");
    return res.send(reply);

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.setHeader("Content-Type", "text/plain").send("...");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Sheyaa running");
});
