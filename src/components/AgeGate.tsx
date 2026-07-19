import { useState } from "react";
import { ShieldCheck } from "lucide-react";

const STORAGE_KEY = "age_verified";

export function useAgeVerified() {
  const [verified, setVerified] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "true"
  );

  const confirm = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVerified(true);
  };

  return { verified, confirm };
}

export function AgeGate({ onConfirm }: { onConfirm: () => void }) {
  const [declined, setDeclined] = useState(false);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0e1a]">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-[#0a0e1a] to-[#0a0e1a]" />

      <div className="relative w-full max-w-md mx-4 p-8 rounded-2xl border border-slate-700/60 bg-[#111827] shadow-2xl shadow-black/40 text-center">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-purple-600/10 border border-purple-500/30 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Age Verification Required
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          You must be 21 years of age or older to access this website.
          By entering, you confirm that you meet the minimum age requirement.
        </p>

        {declined ? (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 mb-4">
            <p className="text-red-300 text-sm font-medium">
              You must be 21 or older to access this site.
            </p>
          </div>
        ) : null}

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-purple-600/20"
          >
            I am 21 or older
          </button>
          <button
            onClick={() => setDeclined(true)}
            className="w-full py-3 px-6 bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-slate-300 font-medium rounded-xl border border-slate-700/50 transition-colors"
          >
            I am under 21
          </button>
        </div>

        <p className="mt-5 text-[11px] text-slate-500 leading-relaxed">
          This site is intended for individuals of legal purchasing age only.
        </p>
      </div>
    </div>
  );
}
