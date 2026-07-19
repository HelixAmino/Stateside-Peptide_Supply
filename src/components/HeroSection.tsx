import { ShieldCheck, FlaskConical, ArrowRight } from 'lucide-react';

export function HeroSection({ onBrowse }: { onBrowse?: () => void }) {
  return (
    <section className="relative overflow-hidden bg-[#0a0e1a] min-h-[520px] flex items-center">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Purple radial glow - top right */}
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      {/* Purple radial glow - bottom left */}
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-700/8 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/5 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-xs font-medium tracking-wide text-purple-300 uppercase">
                Processed, Filtered and Lyophilized in the USA
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] tracking-tight">
              <span className="bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 bg-clip-text text-transparent">
                Premium RUO Peptides
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-300 via-purple-400 to-purple-300 bg-clip-text text-transparent">
                Wholesale Only
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base lg:text-lg text-slate-400 leading-relaxed max-w-xl">
              Minimum order quantity 5 Kits. Every batch ships with
              verifiable 3rd party Certificates of Analysis. Volume pricing
              tiers: 5–9 kits, 10–24 kits, 25–99 kits, and 100+ kits.
            </p>

            {/* CTA + trust signals */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <button
                onClick={onBrowse}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:from-purple-500 hover:to-purple-400 transition-all duration-300"
              >
                <span>Build Your Order</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 rounded-xl border border-purple-400/20" />
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center">
                  <ShieldCheck className="w-4.5 h-4.5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">COA Verified</p>
                  <p className="text-[11px] text-slate-500">Every batch tested</p>
                </div>
              </div>
              <div className="w-px h-8 bg-slate-700/50 hidden sm:block" />
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center">
                  <FlaskConical className="w-4.5 h-4.5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">Research Use Only</p>
                  <p className="text-[11px] text-slate-500">Not for human consumption</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Logo image */}
          <div className="relative flex items-center justify-center">
            {/* Outer glow rings */}
            <div className="absolute w-80 h-80 lg:w-96 lg:h-96 rounded-full border border-purple-500/10 animate-spin-slow" />
            <div className="absolute w-72 h-72 lg:w-80 lg:h-80 rounded-full border border-purple-400/5 animate-spin-reverse" />

            {/* Pulsating orange glow */}
            <div className="absolute w-80 h-80 rounded-full bg-purple-500/40 blur-[100px] animate-pulse" />

            {/* Logo */}
            <div className="relative z-10 w-[480px] h-[480px] lg:w-[600px] lg:h-[600px] flex items-center justify-center">
              <img
                src="/spstranPSai copy copy.png"
                alt="Stateside Peptide Supply"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom edge gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
    </section>
  );
}
