import { useState, useEffect } from "react";
import { Trash2, Minus, Plus, X, ShoppingCart, Loader2, ExternalLink } from "lucide-react";
import { useCart, type CartItem } from "../lib/cart";

function QtyControl({ item, loading, setQty }: { item: CartItem; loading: boolean; setQty: (key: string, qty: number) => void }) {
  const [localVal, setLocalVal] = useState(String(item.qty));

  useEffect(() => {
    setLocalVal(String(item.qty));
  }, [item.qty]);

  const commit = () => {
    const val = parseInt(localVal, 10);
    if (!isNaN(val) && val > 0 && val !== item.qty) {
      setQty(item.itemKey, val);
    } else {
      setLocalVal(String(item.qty));
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setQty(item.itemKey, item.qty - 1)}
        disabled={loading}
        className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50 transition-colors"
      >
        <Minus className="w-3 h-3" />
      </button>
      <input
        type="number"
        min={1}
        value={localVal}
        disabled={loading}
        onChange={(e) => setLocalVal(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); }}
        className="w-10 text-center text-sm font-medium border border-slate-200 rounded py-0.5 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        onClick={() => setQty(item.itemKey, item.qty + 1)}
        disabled={loading}
        className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50 transition-colors"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}

export function CartPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cart = useCart();
  const [customerId, setCustomerId] = useState("");

  const canCheckout = cart.count >= 5 && !cart.loading && customerId.trim().length > 0;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Slide-over */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-slate-700" />
              <h2 className="text-lg font-semibold text-slate-900">
                Order Summary
              </h2>
              {cart.count > 0 && (
                <span className="bg-slate-900 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cart.count}
                </span>
              )}
              {cart.loading && <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Error banner */}
          {cart.error && (
            <div className="px-6 py-2 bg-red-50 border-b border-red-100">
              <p className="text-xs text-red-600">{cart.error}</p>
            </div>
          )}

          {/* Items */}
          <div className="flex-1 overflow-auto px-6 py-4">
            {cart.items.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No items yet</p>
                <p className="text-sm mt-1">Add products from the catalog</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {cart.items.map((item) => (
                  <li
                    key={item.itemKey}
                    className="flex gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.sku}
                        {item.size && ` \u00B7 ${item.size}`}
                      </p>
                      {item.unitPrice > 0 && (
                        <p className="text-sm font-bold text-slate-700 mt-0.5">
                          ${item.unitPrice.toFixed(2)} /kit
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => cart.remove(item.itemKey)}
                        disabled={cart.loading}
                        className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 disabled:opacity-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <QtyControl item={item} loading={cart.loading} setQty={cart.setQty} />
                      <p className="text-sm font-semibold text-slate-900">
                        ${item.lineTotal.toFixed(2)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {cart.items.length > 0 && (
            <div className="border-t border-slate-200 px-6 py-4 space-y-3">
              {cart.count < 5 && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                  <span>Minimum order is 5 kits total ({5 - cart.count} more needed)</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold text-slate-900">
                <span>Subtotal</span>
                <span>${cart.subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-400">Shipping & tax calculated at checkout</p>

              <div className="mt-2">
                <label htmlFor="customer-id" className="block text-xs font-medium text-slate-700 mb-1">
                  Customer ID <span className="text-red-500">*</span>
                </label>
                <input
                  id="customer-id"
                  type="text"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="Enter your unique Customer ID"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 placeholder:text-slate-400 transition-all"
                />
                {customerId.trim().length === 0 && (
                  <p className="text-[11px] text-slate-500 mt-1">Required to proceed to checkout</p>
                )}
              </div>

              <button
                onClick={() => cart.checkout(customerId.trim())}
                disabled={!canCheckout}
                className="w-full mt-3 px-4 py-3 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-500 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Proceed to Checkout
              </button>
              <button
                onClick={() => cart.clear()}
                disabled={cart.loading}
                className="w-full px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Clear Order
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
