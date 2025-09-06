import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Inicializa cliente OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Defina no .env
});

// Rota para melhorar resumo
app.post("/api/improve-summary", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Texto vazio ou inválido" });
    }

    // Chamada ao GPT
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // modelo leve e rápido
      messages: [
        {
          role: "system",
          content: "Você é um especialista em Recursos Humanos que ajuda candidatos a escrever resumos profissionais curtos, claros e impactantes para currículos.",
        },
        {
          role: "user",
          content: `Melhore este resumo profissional mantendo o tom formal e conciso:\n\n"${text}"`,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const improvedText = response.choices[0]?.message?.content?.trim();

    res.json({ improvedText });
  } catch (error) {
    console.error("Erro ao melhorar resumo:", error);
    res.status(500).json({ error: "Erro interno ao processar texto" });
  }
});

// Porta do servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
app.get("/", (req, res) => {
  res.send("🚀 Servidor rodando! Use /api/improve-summary para testar a IA.");
});


