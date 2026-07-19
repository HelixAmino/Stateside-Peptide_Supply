import { useState, useMemo } from "react";
import { Search, Plus, Minus, ShoppingCart, ChevronDown, Package } from "lucide-react";
import { PRODUCTS, CATEGORIES, computeTiers, getActiveTierIndex, type Product } from "../lib/products";
import { useCart } from "../lib/cart";

function TierBadge({ basePrice, totalQty }: { basePrice: number; totalQty: number }) {
  if (totalQty < 10) return null;
  const tiers = computeTiers(basePrice);
  const idx = getActiveTierIndex(totalQty);
  const price = tiers[idx].price;
  if (price >= basePrice) return null;
  const pct = Math.round(((basePrice - price) / basePrice) * 100);
  return (
    <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded">
      -{pct}%
    </span>
  );
}

function ProductRow({ product, qty, totalCartQty, onQtyChange, onAdd }: {
  product: Product;
  qty: number;
  totalCartQty: number;
  onQtyChange: (val: number) => void;
  onAdd: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const tiers = computeTiers(product.basePrice);
  const activeTierIdx = getActiveTierIndex(totalCartQty);

  return (
    <div className="group border border-slate-700/50 rounded-xl bg-slate-800/60 hover:bg-slate-800/90 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 py-3.5">
        {/* Product info + price row */}
        <div className="flex items-start sm:items-center justify-between gap-3 flex-1 min-w-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-slate-100">{product.name}</h3>
              <TierBadge basePrice={product.basePrice} totalQty={totalCartQty} />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-mono text-slate-500">{product.sku}</span>
              <span className="text-slate-600">|</span>
              <span className="text-xs text-slate-400">{product.specification}</span>
            </div>
          </div>

          {/* Price */}
          <div className="text-right shrink-0">
            <p className="text-[10px] text-slate-500 leading-tight">As Low As</p>
            <p className="text-sm font-bold text-slate-100">${tiers[3].price}<span className="text-[10px] font-normal text-slate-500">/kit</span></p>
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-0.5 text-[10px] text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              View tiers
              <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {/* Quantity + Add */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onQtyChange(Math.max(0, qty - 1))}
            disabled={qty === 0}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-600 text-slate-400 hover:bg-slate-700 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <input
            type="number"
            min={0}
            value={qty || ""}
            onChange={(e) => onQtyChange(parseInt(e.target.value) || 0)}
            placeholder="0"
            className="w-14 text-center text-sm font-medium border border-slate-600 rounded-lg py-1.5 bg-slate-900/60 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={() => onQtyChange(qty + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-600 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onAdd}
            disabled={qty === 0}
            title={qty === 0 ? "Set quantity first" : "Add to order"}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-purple-600 text-white hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tier breakdown */}
      {expanded && (
        <div className="px-4 pb-3.5 pt-0">
          <div className="grid grid-cols-4 gap-2">
            {tiers.map((tier, idx) => {
              const isActive = idx === activeTierIdx && totalCartQty >= 5;
              return (
                <div
                  key={tier.label}
                  className={`text-center py-2 px-2 rounded-lg border transition-colors ${
                    isActive
                      ? "border-purple-500/40 bg-purple-500/10"
                      : "border-slate-700/50 bg-slate-900/40"
                  }`}
                >
                  <p className={`text-[10px] font-medium uppercase tracking-wide ${isActive ? "text-purple-300" : "text-slate-500"}`}>
                    {tier.label}
                  </p>
                  <p className={`text-sm font-bold mt-0.5 ${isActive ? "text-purple-300" : "text-slate-300"}`}>
                    ${tier.price}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function ProductCatalog() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const cart = useCart();

  const filtered = useMemo(() => {
    let list = PRODUCTS;
    if (categoryFilter) {
      list = list.filter((p) => p.category === categoryFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.specification.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    return list;
  }, [search, categoryFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, Product[]>();
    for (const p of filtered) {
      const cat = p.category;
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(p);
    }
    return map;
  }, [filtered]);

  function getQty(sku: string) {
    return quantities[sku] || 0;
  }

  function setQty(sku: string, val: number) {
    setQuantities((prev) => ({ ...prev, [sku]: Math.max(0, val) }));
  }

  function addToCart(product: Product) {
    const qty = getQty(product.sku);
    if (qty === 0) return;
    if (product.productId === 0) {
      alert("This product is not yet linked to WooCommerce. Product ID is required.");
      return;
    }
    cart.add(product.productId, qty);
    setQty(product.sku, 0);
  }

  function addAllToCart() {
    const toAdd = filtered.filter((p) => getQty(p.sku) >= 1 && p.productId !== 0);
    for (const product of toAdd) {
      const qty = getQty(product.sku);
      cart.add(product.productId, qty);
    }
    setQuantities({});
  }

  const pendingCount = Object.entries(quantities).filter(([, v]) => v >= 1).length;

  return (
    <div className="flex flex-col bg-[#0a0e1a]">
      {/* Toolbar */}
      <div className="sticky top-14 z-10 bg-[#0d1220]/95 backdrop-blur-sm border-b border-slate-700/50 px-4 lg:px-6 py-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search products, SKUs, categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 bg-slate-800/60 text-slate-200 placeholder:text-slate-500 transition-colors"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 text-sm border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 bg-slate-800/60 text-slate-200"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Package className="w-3.5 h-3.5" />
            <span>{filtered.length} products</span>
          </div>
          {pendingCount > 0 && (
            <button
              onClick={addAllToCart}
              className="ml-auto inline-flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/20"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add {pendingCount} to Order
            </button>
          )}
        </div>
        <p className="text-[11px] text-slate-500 mt-2">Minimum order: 5 kits total (mix & match). Volume tiers apply to entire order quantity.</p>
      </div>

      {/* Product grid */}
      <div className="px-4 lg:px-6 py-5 space-y-8">
        {[...grouped.entries()].map(([category, products]) => (
          <section key={category}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400/70 mb-3 px-1">{category}</h2>
            <div className="space-y-2">
              {products.map((p) => (
                <ProductRow
                  key={p.sku}
                  product={p}
                  qty={getQty(p.sku)}
                  totalCartQty={cart.count}
                  onQtyChange={(val) => setQty(p.sku, val)}
                  onAdd={() => addToCart(p)}
                />
              ))}
            </div>
          </section>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No products match your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
