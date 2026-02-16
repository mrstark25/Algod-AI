import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class StockToolService {
  async getAsset(symbol: string) {
    const { data } = await axios.get(
      `https://query1.finance.yahoo.com/v7/finance/quote`,
      {
        params: { symbols: symbol },
      }
    );

    return data.quoteResponse.result[0];
  }
}
