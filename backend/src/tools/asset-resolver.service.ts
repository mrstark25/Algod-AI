import { Injectable } from "@nestjs/common";
import axios from "axios";
import { ResolvedAsset } from '../types/resolved-asset.type';


@Injectable()
export class AssetResolverService {

  // 🔎 Detect crypto via CoinGecko search
  async searchCrypto(query: string) {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/search",
      {
        params: { query },
      }
    );

    if (!data.coins?.length) return null;

    const coin = data.coins[0];

    return {
      type: "crypto" as const,
      symbol: coin.symbol.toUpperCase(),
      id: coin.id,
      name: coin.name,
    };
  }

  // 🔎 Detect stock / ETF / commodity via Yahoo Finance
  async searchStock(query: string) {
    const { data } = await axios.get(
      "https://query1.finance.yahoo.com/v1/finance/search",
      {
        params: { q: query },
      }
    );

    if (!data.quotes?.length) return null;

    const asset = data.quotes[0];

    return {
      type: "stock" as const,
      symbol: asset.symbol,
      name: asset.shortname || asset.longname,
    };
  }

  // 🧠 Master resolver
  async resolveAsset(query: string): Promise<ResolvedAsset | null> {
    // try crypto first
    const crypto = await this.searchCrypto(query);
    if (crypto) return crypto;

    // fallback to stocks/ETF/metals
    const stock = await this.searchStock(query);
    if (stock) return stock;

    return null;
  }
}
