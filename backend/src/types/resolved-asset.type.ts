export type ResolvedAsset = {
  type: "crypto" | "stock";
  symbol?: string;
  id?: string;
  name: string;
};
