import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a compassionate emotional support assistant. Validate feelings, give practical advice, avoid diagnosis, ask gentle questions."
          },
          { role: "user", content: message }
        ],
      }),
    }
  );

  const data = await response.json();
  res.json({ reply: data.choices[0].message.content });
});

app.listen(5000, () =>
  console.log("Server running on port 5000")
);
