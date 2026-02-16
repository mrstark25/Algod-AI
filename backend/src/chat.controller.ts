import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { InvestmentAgent } from './agents/investment.agent';

@Controller('chat')
export class ChatController {
  constructor(private agent: InvestmentAgent) {}

  @Post('message')
  async message(@Body() body, @Res() res: Response) {

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.flushHeaders?.();

    const stream = await this.agent.execute(body.message);

    for await (const chunk of stream as any) {
      const text = chunk.choices?.[0]?.delta?.content;

      if (!text) continue;

      // ✅ send clean JSON SSE event
      res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
    }

    res.write(`data: [DONE]\n\n`);
    res.end();
  }
}
