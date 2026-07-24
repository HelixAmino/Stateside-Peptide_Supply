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

export const CATALOG: CatalogItem[] = catalogData as CatalogItem[];
