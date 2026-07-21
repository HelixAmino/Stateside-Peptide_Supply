import { useState, useEffect, useCallback } from "react";
import { Trash2, Minus, Plus, X, ShoppingCart, Loader2, ExternalLink, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useCart, type CartItem } from "../lib/cart";

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  "https://xvkzxjbpqbruuywebogn.supabase.co";
const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2a3p4amJwcWJydXV5d2Vib2duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0MTI3MTUsImV4cCI6MjA5OTk4ODcxNX0.6zmTKC4wmPEiCcwNeOpPyD-buj1PAE1ZTSt39aVM_0Q";

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
  const [idStatus, setIdStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const validateMemberId = useCallback(async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setIdStatus("idle");
      return;
    }
    setIdStatus("checking");
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/members?select=member_id&member_id=ilike.${encodeURIComponent(trimmed)}&active=eq.true`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      );
      if (!res.ok) {
        setIdStatus("invalid");
        return;
      }
      const rows = await res.json();
      setIdStatus(Array.isArray(rows) && rows.length > 0 ? "valid" : "invalid");
    } catch {
      setIdStatus("invalid");
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      validateMemberId(customerId);
    }, 500);
    return () => clearTimeout(timeout);
  }, [customerId, validateMemberId]);

  const canCheckout = cart.count >= 5 && !cart.loading && idStatus === "valid";

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
                  Member ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="customer-id"
                    type="text"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    placeholder="Enter your Member ID"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 placeholder:text-slate-400 transition-all pr-9 ${
                      idStatus === "valid"
                        ? "border-green-400 focus:ring-green-500/40 focus:border-green-500"
                        : idStatus === "invalid"
                        ? "border-red-400 focus:ring-red-500/40 focus:border-red-500"
                        : "border-slate-300 focus:ring-purple-500/40 focus:border-purple-500"
                    }`}
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    {idStatus === "checking" && <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />}
                    {idStatus === "valid" && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {idStatus === "invalid" && <XCircle className="w-4 h-4 text-red-500" />}
                  </div>
                </div>
                {idStatus === "idle" && customerId.trim().length === 0 && (
                  <p className="text-[11px] text-slate-500 mt-1">Required to proceed to checkout</p>
                )}
                {idStatus === "invalid" && (
                  <p className="text-[11px] text-red-500 mt-1">Invalid Member ID. Please check and try again.</p>
                )}
                {idStatus === "valid" && (
                  <p className="text-[11px] text-green-600 mt-1">Member ID verified</p>
                )}
              </div>

              <button
                onClick={() => setShowDisclaimer(true)}
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
      {showDisclaimer && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDisclaimer(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Research Use Only Disclaimer</h3>
              </div>

              <div className="space-y-4 text-sm text-slate-700 leading-relaxed border-t border-b border-slate-200 py-4 my-4">
                <p className="font-semibold text-slate-900">
                  IMPORTANT NOTICE: All products sold by SPS are intended for In-Vitro Research Use Only (RUO).
                </p>
                <p>
                  By proceeding with this purchase, you acknowledge and agree to the following terms:
                </p>
                <ol className="list-decimal list-outside ml-5 space-y-2">
                  <li>
                    All products purchased from SPS are designated as Research Use Only (RUO) and are intended solely for in-vitro research, laboratory experimentation, and scientific investigation purposes.
                  </li>
                  <li>
                    These products are <span className="font-semibold">NOT</span> intended for human or animal diagnostic use, therapeutic use, drug use, food use, cosmetic use, or for any in-vivo application.
                  </li>
                  <li>
                    These products have not been approved, cleared, or licensed by the FDA or any other regulatory body for use in diagnostic or therapeutic procedures.
                  </li>
                  <li>
                    The purchaser assumes all responsibility for the proper use, handling, storage, and disposal of products in accordance with all applicable local, state, and federal regulations.
                  </li>
                  <li>
                    The purchaser represents that they are qualified to handle research materials and that all products will be used only by trained personnel in an appropriate laboratory setting.
                  </li>
                  <li>
                    SPS makes no claims regarding the safety or efficacy of these products for any use other than in-vitro research. Any use beyond the stated intended purpose is strictly prohibited and done solely at the purchaser's own risk.
                  </li>
                </ol>
                <p className="font-semibold text-slate-900 pt-2">
                  By clicking "I Acknowledge & Continue" below, you confirm that you have read, understood, and agree to abide by all terms of this Research Use Only disclaimer and that your purchase is solely for in-vitro research purposes.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setShowDisclaimer(false);
                    cart.checkout(customerId.trim());
                  }}
                  className="w-full px-4 py-3 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  I Acknowledge & Continue to Checkout
                </button>
                <button
                  onClick={() => setShowDisclaimer(false)}
                  className="w-full px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
