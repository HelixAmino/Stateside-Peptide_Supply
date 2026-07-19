import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as cocart from "./cocart";
import { getPriceForTotalQty, PRODUCTS } from "./products";

export type CartItem = {
  itemKey: string;
  productId: number;
  sku: string;
  name: string;
  size: string;
  qty: number;
  lineTotal: number;
  unitPrice: number;
};

type CartCtx = {
  items: CartItem[];
  add: (productId: number, quantity: number) => Promise<void>;
  remove: (itemKey: string) => Promise<void>;
  setQty: (itemKey: string, qty: number) => Promise<void>;
  clear: () => Promise<void>;
  checkout: () => void;
  count: number;
  subtotal: number;
  total: number;
  cartKey: string;
  loading: boolean;
  error: string | null;
};

const Ctx = createContext<CartCtx | null>(null);

function parseCartResponse(data: cocart.CoCartResponse): {
  items: CartItem[];
  subtotal: number;
  total: number;
  cartKey: string;
  count: number;
} {
  const totalQty = data.item_count ?? Object.values(data.items ?? {}).reduce((n, i) => n + (i.quantity?.value ?? 0), 0);

  const items: CartItem[] = Object.values(data.items ?? {}).map((item) => {
    const product = PRODUCTS.find(
      (p) => p.productId === Number(item.id) || p.sku === (item.meta?.sku ?? "")
    );
    const unitPrice = product
      ? getPriceForTotalQty(product.basePrice, totalQty)
      : 0;
    const qty = item.quantity?.value ?? 0;
    return {
      itemKey: item.item_key,
      productId: Number(item.id),
      sku: item.meta?.sku ?? "",
      name: item.name ?? product?.name ?? "Unknown",
      size: product?.specification ?? "",
      qty,
      lineTotal: unitPrice * qty,
      unitPrice,
    };
  });

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);

  return {
    items,
    subtotal,
    total: subtotal,
    cartKey: data.cart_key ?? "",
    count: totalQty,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [cartKey, setCartKey] = useState(() => localStorage.getItem("cocart_cart_key") || "");
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncFromResponse = useCallback((data: cocart.CoCartResponse) => {
    const parsed = parseCartResponse(data);
    setItems(parsed.items);
    setSubtotal(parsed.subtotal);
    setTotal(parsed.total);
    setCartKey(parsed.cartKey);
    setCount(parsed.count);
    setError(null);
  }, []);

  useEffect(() => {
    setLoading(true);
    cocart
      .fetchCart()
      .then(syncFromResponse)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [syncFromResponse]);

  const value = useMemo<CartCtx>(() => {
    return {
      items,
      count,
      subtotal,
      total,
      cartKey,
      loading,
      error,
      add: async (productId, quantity) => {
        setLoading(true);
        try {
          const data = await cocart.addItem(productId, quantity);
          syncFromResponse(data);
        } catch (e: any) {
          setError(e.message);
          const fresh = await cocart.fetchCart().catch(() => null);
          if (fresh) syncFromResponse(fresh);
        } finally {
          setLoading(false);
        }
      },
      remove: async (itemKey) => {
        setLoading(true);
        try {
          await cocart.removeItem(itemKey);
          const fresh = await cocart.fetchCart();
          syncFromResponse(fresh);
        } catch (e: any) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      },
      setQty: async (itemKey, qty) => {
        setLoading(true);
        try {
          if (qty <= 0) {
            await cocart.removeItem(itemKey);
            const fresh = await cocart.fetchCart();
            syncFromResponse(fresh);
          } else {
            const data = await cocart.updateItemQty(itemKey, qty);
            syncFromResponse(data);
          }
        } catch (e: any) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      },
      clear: async () => {
        setLoading(true);
        try {
          await cocart.clearCart();
          cocart.clearStoredCartKey();
          setItems([]);
          setSubtotal(0);
          setTotal(0);
          setCount(0);
          setError(null);
        } catch (e: any) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      },
      checkout: () => {
        if (cartKey) {
          window.location.href = cocart.getCheckoutUrl(cartKey);
        }
      },
    };
  }, [items, count, subtotal, total, cartKey, loading, error, syncFromResponse]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
