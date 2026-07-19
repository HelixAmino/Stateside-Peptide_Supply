import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQ_DATA = [
  {
    q: "Where are your peptides made?",
    a: "Raw powders are synthesized in India and China, then finished, reconstituted, filtered, lyophilized, and packaged in the USA. All orders ship from the USA.",
  },
  {
    q: "Are your products tested for purity?",
    a: "After lyophilization, every finished product undergoes third-party lab testing, and a fully verifiable electronic COA is provided with each order.",
  },
  {
    q: "What purity do you guarantee?",
    a: "All peptides are 98.5% pure or better. 95% of our products test at 99% purity or better.",
  },
  {
    q: "What if a product fails third-party testing?",
    a: "If any verifiable third-party test shows purity below 98.5%, detectable endotoxin, or unacceptable heavy metal content, the purchaser receives a full refund of three times their purchase price plus a product replacement. It just doesn't happen with our quality control procedures.",
  },
  {
    q: "What is the minimum order size?",
    a: "Five kits. First-time orders receive a one pricing tier discount.",
  },
  {
    q: "How do I place an order?",
    a: "New members must register, complete vetting, and receive a unique Member ID before checkout. Orders cannot be placed without entering this code.",
  },
  {
    q: "What payment methods do you accept?",
    a: "A variety of payment terms are accepted, including credit card (4% fee), ACH, crypto (4% discount), and Venmo. The options appear at checkout.",
  },
  {
    q: "How quickly do orders ship?",
    a: "Small to medium orders usually ship within 48 hours. Larger orders of 50 kits or more may take 7 to 10 days.",
  },
  {
    q: "What is your return policy?",
    a: "All sales final\u2014no returns or exchanges.",
  },
  {
    q: "How should I store the peptides?",
    a: "All products are packaged within 90 days of shipment. Lyophilized powders are stable for multiple years at room temperature, but we recommend freezer storage for maximum longevity.",
  },
  {
    q: "Is private labeling available?",
    a: 'Yes, it\u2019s available. If you\u2019re interested, email info@statesidepeptidesupply.com',
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-slate-700/50 rounded-xl overflow-hidden transition-colors hover:border-purple-500/30">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-slate-800/60 hover:bg-slate-800/90 transition-colors"
      >
        <span className="text-sm font-semibold text-slate-100">{question}</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-purple-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-200 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <p className="px-5 py-4 text-sm text-slate-400 leading-relaxed border-t border-slate-700/30 bg-slate-900/40">
            {question === "Is private labeling available?" ? (
              <>
                Yes, it&#8217;s available. If you&#8217;re interested, email{" "}
                <a
                  href="mailto:info@statesidepeptidesupply.com"
                  className="text-purple-400 hover:text-purple-300 underline underline-offset-2"
                >
                  info@statesidepeptidesupply.com
                </a>
              </>
            ) : (
              answer
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FaqPage() {
  return (
    <div className="bg-[#0a0e1a] min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-5">
            <HelpCircle className="w-7 h-7 text-purple-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-100 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-slate-400 text-sm max-w-lg mx-auto">
            Everything you need to know about ordering, quality, and logistics.
          </p>
        </div>

        {/* FAQ items */}
        <div className="space-y-3">
          {FAQ_DATA.map((item) => (
            <FaqItem key={item.q} question={item.q} answer={item.a} />
          ))}
        </div>
      </div>
    </div>
  );
}
