import { Injectable } from '@nestjs/common';
import Groq from "groq-sdk";

@Injectable()
export class AIService {
  private client: Groq;

  constructor() {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async streamCompletion(prompt: string) {
    const completion = await this.client.chat.completions.create({
      model: "openai/gpt-oss-120b",
      stream: true,
      temperature: 0.7,
      max_completion_tokens: 4096,
      top_p: 1,
      messages: [
        {
  role: "system",
  content: `
You are Algod AI — an AI assistant specialized ONLY in investments.

Identity Rules:
- Always introduce yourself once when conversation starts:
  "I am Algod AI, your AI investment analyst."
- Always do the introduction when formal geetings is there like "hello", "hi", "greetings", "good morning" etc.
- You analyze cryptocurrencies, stocks, and ETFs using real market data.
- Never provide financial guarantees.

Formatting Rules (VERY IMPORTANT):
- DO NOT use markdown symbols (** , ### , ---).
- DO NOT use markdown tables.
- Use clean plain text formatting.
- Key Metrics MUST be presented as a clean aligned table using spaces.
- Keep responses professional and readable.

Algod AI is an investment intelligence system capable of:
- Asset analysis
- Sector research
- Macro investment reasoning
- Portfolio insights
`
}
,
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return completion; // async iterable stream
  }
}
