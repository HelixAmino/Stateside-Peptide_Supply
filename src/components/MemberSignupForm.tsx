import { useState, type FormEvent } from "react";
import { UserPlus, CheckCircle, AlertCircle } from "lucide-react";

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  "https://wwmpgpsyvbbdrxjjsbui.supabase.co";
const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3bXBncHN5dmJiZHJ4ampzYnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNDM0NjEsImV4cCI6MjA5NjYxOTQ2MX0.J1dIBtMdNDpQFbWmcEHjA3rUJVX_Wgzv3DOSXPiwPis";

type FormState = "idle" | "submitting" | "success" | "error";

export function MemberSignupForm({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [monthlyVolume, setMonthlyVolume] = useState("");
  const [notes, setNotes] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isValid =
    name.trim() &&
    companyName.trim() &&
    email.trim() &&
    phone.trim() &&
    monthlyVolume.trim();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setFormState("submitting");
    setErrorMsg("");

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/member_applications`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          name: name.trim(),
          company_name: companyName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          sms_opt_in: smsOptIn,
          monthly_volume: monthlyVolume.trim(),
          notes: notes.trim() || null,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        let msg = "Submission failed. Please try again.";
        try {
          const body = JSON.parse(text);
          if (body?.message) msg = body.message;
        } catch {}
        throw new Error(msg);
      }

      setFormState("success");
    } catch (err: unknown) {
      setFormState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (formState === "success") {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center p-8 rounded-2xl border border-slate-700/60 bg-[#111827]">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Application Submitted</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Thank you for your interest. We will review your application and get back to you shortly.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] py-12 px-4">
      <div className="max-w-lg mx-auto">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white text-sm mb-6 transition-colors"
        >
          &larr; Back
        </button>

        <div className="rounded-2xl border border-slate-700/60 bg-[#111827] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-600/10 border border-purple-500/30 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Member Application</h1>
              <p className="text-slate-400 text-xs">Fill out all required fields to apply</p>
            </div>
          </div>

          {formState === "error" && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-300 text-sm">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full Name" required>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Smith"
                className={inputClass}
              />
            </Field>

            <Field label="Company / Group Name" required>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Corp"
                className={inputClass}
              />
            </Field>

            <Field label="Email" required>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className={inputClass}
              />
            </Field>

            <Field label="Phone Number" required>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className={inputClass}
              />
            </Field>

            <div className="flex items-start gap-3 py-2">
              <input
                id="sms-opt-in"
                type="checkbox"
                checked={smsOptIn}
                onChange={(e) => setSmsOptIn(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-600 bg-slate-800 text-purple-600 focus:ring-purple-500/40 focus:ring-offset-0"
              />
              <label htmlFor="sms-opt-in" className="text-sm text-slate-300 leading-tight cursor-pointer">
                I agree to receive SMS messages regarding my membership and orders
              </label>
            </div>

            <Field label="Monthly Expected Volume" required>
              <input
                type="text"
                value={monthlyVolume}
                onChange={(e) => setMonthlyVolume(e.target.value)}
                placeholder="e.g. 250 kits, $7,500"
                className={inputClass}
              />
            </Field>

            <Field label="Notes" hint="100 characters max">
              <textarea
                value={notes}
                onChange={(e) => {
                  if (e.target.value.length <= 100) setNotes(e.target.value);
                }}
                placeholder="Any additional information..."
                rows={3}
                className={inputClass + " resize-none"}
              />
              <span className="text-[11px] text-slate-500 mt-1 block text-right">
                {notes.length}/100
              </span>
            </Field>

            <button
              type="submit"
              disabled={!isValid || formState === "submitting"}
              className="w-full mt-2 py-3 px-6 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-xl transition-all disabled:cursor-not-allowed"
            >
              {formState === "submitting" ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2.5 text-sm bg-slate-800/60 border border-slate-700/60 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all";

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
        {hint && <span className="text-slate-500 font-normal ml-1">({hint})</span>}
      </label>
      {children}
    </div>
  );
}
