const BASE_URL = import.meta.env.DEV
  ? "/wp-json/cocart/v2"
  : "https://floorabovebrands.com/wp-json/cocart/v2";

const CART_KEY_STORAGE = "cocart_cart_key";

function getStoredCartKey(): string | null {
  return localStorage.getItem(CART_KEY_STORAGE);
}

function storeCartKey(key: string) {
  if (key) localStorage.setItem(CART_KEY_STORAGE, key);
}

export function clearStoredCartKey() {
  localStorage.removeItem(CART_KEY_STORAGE);
}

export type CoCartItem = {
  item_key: string;
  id: string;
  name: string;
  quantity: { value: number };
  price: string;
  totals: {
    total: number;
    subtotal: number;
  };
  meta: {
    product_type: string;
    sku: string;
  };
};

export type CoCartResponse = {
  cart_key: string;
  items: Record<string, CoCartItem>;
  totals: {
    subtotal: string;
    total: string;
  };
  item_count: number;
};

function buildUrl(path: string): string {
  const cartKey = getStoredCartKey();
  const url = `${BASE_URL}${path}`;
  if (cartKey) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}cart_key=${encodeURIComponent(cartKey)}`;
  }
  return url;
}

function cartKeyHeaders(): Record<string, string> {
  const cartKey = getStoredCartKey();
  if (cartKey) {
    return { "CoCart-API-Cart-Key": cartKey };
  }
  return {};
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(buildUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...cartKeyHeaders(),
      ...(options?.headers ?? {}),
    },
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`CoCart ${res.status}: ${text}`);
  }
  const data = await res.json();
  if (data && data.cart_key) {
    storeCartKey(data.cart_key);
  }
  return data;
}

export async function fetchCart(): Promise<CoCartResponse> {
  return request<CoCartResponse>("/cart");
}

export async function addItem(productId: number, quantity: number): Promise<CoCartResponse> {
  return request<CoCartResponse>("/cart/add-item", {
    method: "POST",
    body: JSON.stringify({
      id: String(productId),
      quantity: String(quantity),
    }),
  });
}

export async function updateItemQty(itemKey: string, quantity: number): Promise<CoCartResponse> {
  return request<CoCartResponse>(`/cart/item/${itemKey}`, {
    method: "POST",
    body: JSON.stringify({
      quantity: String(quantity),
    }),
  });
}

export async function removeItem(itemKey: string): Promise<CoCartResponse> {
  return request<CoCartResponse>(`/cart/item/${itemKey}`, {
    method: "DELETE",
  });
}

export async function clearCart(): Promise<CoCartResponse> {
  return request<CoCartResponse>("/cart/clear", {
    method: "POST",
  });
}

export function getCheckoutUrl(cartKey: string): string {
  return `https://floorabovebrands.com/checkout/?cocart-load-cart=${cartKey}`;
}
