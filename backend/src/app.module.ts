import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { AIService } from './ai/ai.service';
import { CryptoToolService } from './tools/crypto.service';
import { StockToolService } from './tools/stock.service';
import { AssetResolverService } from './tools/asset-resolver.service';
import { InvestmentAgent } from './agents/investment.agent';

@Module({
  controllers: [ChatController], // ✅ REQUIRED
  providers: [
    AIService,
    CryptoToolService,
    StockToolService,
    AssetResolverService, // ✅ REQUIRED
    InvestmentAgent,
  ],
})
export class AppModule {}
