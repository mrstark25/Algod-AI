import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CryptoToolService {

  /**
   * Fetch crypto using CoinGecko coin ID
   * Example IDs:
   * bitcoin, ethereum, chainlink, solana
   */
  async getAssetById(id: string) {
    try {
      const { data } = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            ids: id,
            price_change_percentage: "24h,7d,30d",
          },
        }
      );

      if (!data?.length) return null;

      const coin = data[0];

      // ✅ return clean structured data (better for LLM reasoning)
      return {
        type: "crypto",
        name: coin.name,
        symbol: coin.symbol?.toUpperCase(),
        price: coin.current_price,
        market_cap: coin.market_cap,
        volume_24h: coin.total_volume,
        change_24h: coin.price_change_percentage_24h,
        change_7d: coin.price_change_percentage_7d_in_currency,
        change_30d: coin.price_change_percentage_30d_in_currency,
        ath: coin.ath,
        ath_change_percentage: coin.ath_change_percentage,
        circulating_supply: coin.circulating_supply,
        last_updated: coin.last_updated,
      };

    } catch (error) {
      console.error("CoinGecko error:", error.message);
      return null;
    }
  }

  /**
   * OPTIONAL fallback:
   * resolve symbol → id automatically using CoinGecko search
   */
  async getAssetBySymbol(symbol: string) {
    try {
      const { data } = await axios.get(
        "https://api.coingecko.com/api/v3/search",
        {
          params: { query: symbol },
        }
      );

      if (!data.coins?.length) return null;

      const coinId = data.coins[0].id;

      return this.getAssetById(coinId);
    } catch (error) {
      console.error("Symbol search error:", error.message);
      return null;
    }
  }
}
