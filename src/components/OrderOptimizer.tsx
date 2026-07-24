import { useState, useMemo, useCallback } from "react";
import { Search, Trash2, Download, Copy, ChevronDown, ArrowLeft } from "lucide-react";
import { CATALOG, SUPPLIER_NAMES, type CatalogItem, type SupplierName } from "../lib/optimizer-catalog";

type OrderMap = Record<string, number>;

const SUPPLIER_COLORS: Record<SupplierName, string> = {
  "Viv": "border-blue-500 bg-blue-50",
  "价格表": "border-emerald-500 bg-emerald-50",
  "Direct Factory": "border-amber-500 bg-amber-50",
};

const SUPPLIER_BADGE: Record<SupplierName, string> = {
  "Viv": "bg-blue-100 text-blue-800",
  "价格表": "bg-emerald-100 text-emerald-800",
  "Direct Factory": "bg-amber-100 text-amber-800",
};

function rmb(n: number) {
  return "¥" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function usdStr(n: number, rate: number) {
  return "$" + (n / rate).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function OrderOptimizer({ onBack }: { onBack: () => void }) {
  const [order, setOrder] = useState<OrderMap>({});
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | SupplierName>("all");
  const [rate, setRate] = useState(7.2);

  const filteredCatalog = useMemo(() => {
    const q = search.toLowerCase().trim();
    return CATALOG.filter((item) => {
      if (q && !item.product.toLowerCase().includes(q) && !item.strength.includes(q) && !item.spec.toLowerCase().includes(q)) return false;
      if (sourceFilter !== "all" && item.prices[sourceFilter] == null) return false;
      return true;
    });
  }, [search, sourceFilter]);

  const orderSummary = useMemo(() => {
    const ids = Object.keys(order);
    if (!ids.length) return null;

    let totalBoxes = 0;
    let totalCost = 0;
    let maxCost = 0;
    const bySupplier: Record<SupplierName, { item: CatalogItem; qty: number; lineCost: number }[]> = {
      "Viv": [],
      "价格表": [],
      "Direct Factory": [],
    };

    ids.forEach((id) => {
      const item = CATALOG.find((c) => c.id === id);
      if (!item) return;
      const qty = order[id];
      totalBoxes += qty;
      const cost = item.best_price * qty;
      totalCost += cost;

      const available = Object.values(item.prices).filter((p): p is number => p != null);
      const maxP = Math.max(...available);
      maxCost += maxP * qty;

      bySupplier[item.best_source].push({ item, qty, lineCost: cost });
    });

    const savings = maxCost - totalCost;
    return { totalBoxes, totalCost, maxCost, savings, bySupplier };
  }, [order]);

  const setQty = useCallback((id: string, qty: number) => {
    setOrder((prev) => {
      if (qty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: qty };
    });
  }, []);

  const addOne = useCallback((id: string) => {
    setOrder((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }, []);

  const clearOrder = useCallback(() => {
    setOrder({});
  }, []);

  const exportOrders = useCallback(() => {
    if (!orderSummary) return;
    const lines: string[] = ["=== PEPTIDE ORDER SUMMARY ===", `Exchange Rate: 1 USD = ${rate} RMB`, ""];

    SUPPLIER_NAMES.forEach((supplier) => {
      const items = orderSummary.bySupplier[supplier];
      if (!items.length) return;
      const subtotal = items.reduce((s, i) => s + i.lineCost, 0);
      lines.push(`--- ${supplier} (${items.length} items, ${rmb(subtotal)} / ${usdStr(subtotal, rate)}) ---`);
      items.forEach(({ item, qty, lineCost }) => {
        const code = item.codes[supplier] || item.id;
        lines.push(`  ${code} | ${item.product} ${item.strength} | x${qty} | ${rmb(lineCost)} / ${usdStr(lineCost, rate)}`);
      });
      lines.push("");
    });

    lines.push(`TOTAL: ${orderSummary.totalBoxes} boxes | ${rmb(orderSummary.totalCost)} / ${usdStr(orderSummary.totalCost, rate)}`);
    if (orderSummary.savings > 0) {
      lines.push(`SAVINGS vs worst: ${rmb(orderSummary.savings)} / ${usdStr(orderSummary.savings, rate)}`);
    }

    const text = lines.join("\n");
    navigator.clipboard.writeText(text).catch(() => {});
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `order-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [orderSummary, rate]);

  const copySupplierOrder = useCallback(
    (supplier: SupplierName) => {
      if (!orderSummary) return;
      const items = orderSummary.bySupplier[supplier];
      if (!items.length) return;
      const lines = items.map(({ item, qty }) => {
        const code = item.codes[supplier] || item.id;
        return `${code} | ${item.product} ${item.strength} | x${qty}`;
      });
      navigator.clipboard.writeText(lines.join("\n"));
    },
    [orderSummary]
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 rounded-lg hover:bg-slate-200 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Peptide Order Optimizer</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Prices in <strong>RMB</strong> + USD — 10-vial boxes — Auto-splits to cheapest supplier
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm">
              <span className="text-slate-500">1 USD =</span>
              <input
                type="number"
                step="0.01"
                min="1"
                max="20"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value) || 7.2)}
                className="w-16 text-center font-medium focus:outline-none bg-transparent"
              />
              <span className="text-slate-500">RMB</span>
            </div>
            <button
              onClick={clearOrder}
              disabled={!Object.keys(order).length}
              className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Clear Order
            </button>
            <button
              onClick={exportOrders}
              disabled={!orderSummary}
              className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Catalog */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search product (e.g. retatrutide, ss-31, glow)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value as "all" | SupplierName)}
                    className="appearance-none pl-3 pr-8 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="all">All sources</option>
                    <option value="Viv">Has Viv</option>
                    <option value="价格表">Has 价格表</option>
                    <option value="Direct Factory">Has Direct Factory</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Catalog header */}
              <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-slate-200">
                <div className="hidden sm:grid grid-cols-[1fr_80px_80px_80px_100px] gap-2 flex-1 text-xs font-medium text-slate-500 uppercase tracking-wide">
                  <span>Product</span>
                  <span className="text-center">Viv</span>
                  <span className="text-center">价格表</span>
                  <span className="text-center">Direct</span>
                  <span className="text-center">Qty</span>
                </div>
                <span className="text-xs text-slate-400 shrink-0 ml-2">
                  {filteredCatalog.length} of {CATALOG.length} items
                </span>
              </div>

              <div className="max-h-[75vh] overflow-y-auto">
                {filteredCatalog.length === 0 ? (
                  <div className="text-slate-400 text-sm py-8 text-center">No matching products</div>
                ) : (
                  filteredCatalog.map((item) => (
                    <CatalogRow
                      key={item.id}
                      item={item}
                      qty={order[item.id] || 0}
                      rate={rate}
                      onSetQty={(qty) => setQty(item.id, qty)}
                      onAdd={() => addOne(item.id)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <h2 className="font-semibold text-lg mb-3">Your Order</h2>
              <div className="space-y-2 max-h-56 overflow-y-auto text-sm">
                {!orderSummary ? (
                  <div className="text-slate-400 text-sm py-4 text-center">Add products from the catalog</div>
                ) : (
                  Object.keys(order).map((id) => {
                    const item = CATALOG.find((c) => c.id === id);
                    if (!item) return null;
                    const qty = order[id];
                    return (
                      <div key={id} className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <div className="font-medium truncate">
                            {item.product} {item.strength}
                          </div>
                          <div className="text-xs text-slate-500">
                            {item.best_source} @ {rmb(item.best_price)} / {usdStr(item.best_price, rate)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-slate-500">x{qty}</span>
                          <span className="font-medium text-sm">{rmb(item.best_price * qty)}</span>
                          <button onClick={() => setQty(id, 0)} className="text-red-400 hover:text-red-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {orderSummary && (
                <div className="border-t mt-3 pt-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total boxes</span>
                    <span className="font-medium">{orderSummary.totalBoxes}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold">
                    <span>Total Cost</span>
                    <span>
                      {rmb(orderSummary.totalCost)} / {usdStr(orderSummary.totalCost, rate)}
                    </span>
                  </div>
                  {orderSummary.savings > 0 && (
                    <div className="flex justify-between text-green-700 text-xs">
                      <span>vs most expensive option</span>
                      <span>
                        Save {rmb(orderSummary.savings)} / {usdStr(orderSummary.savings, rate)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Supplier breakdown */}
            {orderSummary &&
              SUPPLIER_NAMES.map((supplier) => {
                const items = orderSummary.bySupplier[supplier];
                if (!items.length) return null;
                const subtotal = items.reduce((s, i) => s + i.lineCost, 0);
                return (
                  <div
                    key={supplier}
                    className={`rounded-xl border-l-4 shadow-sm border border-slate-200 p-4 ${SUPPLIER_COLORS[supplier]}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-sm">{supplier}</h3>
                        <p className="text-xs text-slate-600">
                          {items.length} items — {rmb(subtotal)} / {usdStr(subtotal, rate)}
                        </p>
                      </div>
                      <button
                        onClick={() => copySupplierOrder(supplier)}
                        className="p-1.5 rounded hover:bg-white/60 transition-colors"
                        title="Copy order to clipboard"
                      >
                        <Copy className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                    <div className="space-y-1 text-xs max-h-40 overflow-y-auto">
                      {items.map(({ item, qty, lineCost }) => (
                        <div key={item.id} className="flex justify-between">
                          <span className="truncate mr-2">
                            <span className="font-mono text-slate-500">{item.codes[supplier] || "—"}</span>{" "}
                            {item.product} {item.strength} x{qty}
                          </span>
                          <span className="shrink-0 font-medium">{rmb(lineCost)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

function CatalogRow({
  item,
  qty,
  rate,
  onSetQty,
  onAdd,
}: {
  item: CatalogItem;
  qty: number;
  rate: number;
  onSetQty: (qty: number) => void;
  onAdd: () => void;
}) {
  return (
    <div className="flex items-center gap-2 py-2.5 px-2 hover:bg-slate-50 rounded-lg border-b border-slate-100 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{item.product}</div>
        <div className="text-xs text-slate-500">
          {item.strength} — {item.spec}
        </div>
        {/* Mobile price display */}
        <div className="sm:hidden flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
          {SUPPLIER_NAMES.map((s) => {
            const p = item.prices[s];
            if (p == null) return null;
            const isBest = s === item.best_source;
            return (
              <span key={s} className={`text-xs ${isBest ? "font-bold text-green-700" : "text-slate-600"}`}>
                {s}: {rmb(p)} {isBest && "★"}
              </span>
            );
          })}
        </div>
      </div>

      {/* Desktop price columns */}
      {SUPPLIER_NAMES.map((s) => {
        const p = item.prices[s];
        const isBest = s === item.best_source;
        return (
          <div key={s} className="hidden sm:block w-20 text-center">
            {p == null ? (
              <span className="text-slate-300 text-xs">—</span>
            ) : (
              <div>
                <span className={`text-xs ${isBest ? "font-bold text-green-700" : "text-slate-600"}`}>
                  {rmb(p)} {isBest && "★"}
                </span>
                <div className="text-[10px] text-slate-400">{usdStr(p, rate)}</div>
              </div>
            )}
          </div>
        );
      })}

      <div className="flex items-center gap-1.5 shrink-0">
        <input
          type="number"
          min="0"
          max="999"
          value={qty}
          onChange={(e) => onSetQty(parseInt(e.target.value) || 0)}
          onClick={(e) => (e.target as HTMLInputElement).select()}
          className="w-14 px-2 py-1 border border-slate-300 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={onAdd}
          className="px-2.5 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
        >
          +
        </button>
      </div>

      {/* Best source badge */}
      <span className={`hidden lg:inline-block text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap ${SUPPLIER_BADGE[item.best_source]}`}>
        {item.best_source === "Direct Factory" ? "DF" : item.best_source}
      </span>
    </div>
  );
}
