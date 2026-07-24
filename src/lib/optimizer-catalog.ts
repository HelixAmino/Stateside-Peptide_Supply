import catalogData from "./optimizer-catalog.json";

export type SupplierName = "Viv" | "价格表" | "Direct Factory";

export type CatalogItem = {
  id: string;
  product: string;
  strength: string;
  spec: string;
  prices: Record<SupplierName, number | null>;
  codes: Record<SupplierName, string>;
  best_source: SupplierName;
  best_price: number;
};

export const SUPPLIER_NAMES: SupplierName[] = ["Viv", "价格表", "Direct Factory"];

const TIE_PRIORITY: SupplierName[] = ["价格表", "Viv", "Direct Factory"];

export const CATALOG: CatalogItem[] = (catalogData as CatalogItem[]).map((item) => {
  let bestPrice = Infinity;
  let bestSource: SupplierName = item.best_source;
  for (const s of TIE_PRIORITY) {
    const p = item.prices[s];
    if (p != null && p < bestPrice) {
      bestPrice = p;
      bestSource = s;
    }
  }
  return { ...item, best_source: bestSource, best_price: bestPrice === Infinity ? item.best_price : bestPrice };
});
