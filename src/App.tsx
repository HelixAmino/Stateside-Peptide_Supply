import { useState, useRef } from "react";
import { ShoppingCart, Truck, HelpCircle, UserPlus } from "lucide-react";
import { ProductCatalog } from "./components/ProductCatalog";
import { CartPanel } from "./components/CartPanel";
import { HeroSection } from "./components/HeroSection";
import { FaqPage } from "./components/FaqPage";
import { MemberSignupForm } from "./components/MemberSignupForm";
import { AgeGate, useAgeVerified } from "./components/AgeGate";
import { useCart } from "./lib/cart";

type Page = "home" | "faq" | "signup";

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [page, setPage] = useState<Page>("home");
  const cart = useCart();
  const catalogRef = useRef<HTMLDivElement>(null);
  const { verified, confirm: confirmAge } = useAgeVerified();

  if (!verified) {
    return <AgeGate onConfirm={confirmAge} />;
  }

  const scrollToCatalog = () => {
    setPage("home");
    setTimeout(() => {
      catalogRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e1a] overflow-x-hidden">
      {/* Top bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 lg:px-6 h-14 border-b border-slate-700/50 bg-[#0d1220]/95 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setPage("home")} className="flex items-center gap-3">
            <img
              src="/spstranPSai copy copy.png"
              alt="Stateside Peptide Supply"
              className="h-20 w-auto -my-3 translate-y-[7px]"
            />
            <img
              src="/spsbottom.png"
              alt="Stateside Peptide Supply"
              className="h-10 w-auto"
            />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-lg">
              <Truck className="w-3.5 h-3.5" />
              <span className="inline-flex items-center gap-1">Flat $25 shipping | <img src="https://flagcdn.com/w20/us.png" alt="US" className="inline h-3 w-auto" /> Fulfillment</span>
            </div>
          </div>

          <button
            onClick={() => setPage("signup")}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
              page === "signup"
                ? "text-purple-300 bg-purple-500/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Apply</span>
          </button>

          <button
            onClick={() => setPage("faq")}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
              page === "faq"
                ? "text-purple-300 bg-purple-500/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">FAQ</span>
          </button>

          <button
            onClick={() => setCartOpen(true)}
            className="relative inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-500 transition-all hover:shadow-lg hover:shadow-purple-600/20"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Order</span>
            {cart.count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#0d1220]">
                {cart.count}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Page content */}
      {page === "home" && (
        <>
          <HeroSection onBrowse={scrollToCatalog} onApply={() => setPage("signup")} />
          <main ref={catalogRef} className="flex-1">
            <ProductCatalog />
          </main>
        </>
      )}

      {page === "faq" && <FaqPage />}

      {page === "signup" && <MemberSignupForm onBack={() => setPage("home")} />}

      {/* Floating cart button */}
      {cart.count > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 bg-purple-600 text-white text-sm font-semibold rounded-full shadow-xl shadow-purple-900/40 hover:bg-purple-500 hover:scale-105 transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>{cart.count} {cart.count === 1 ? 'item' : 'items'}</span>
          <span className="w-px h-4 bg-purple-400/40" />
          <span>${cart.subtotal.toFixed(2)}</span>
        </button>
      )}

      {/* Cart slide-over */}
      <CartPanel open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default App;
