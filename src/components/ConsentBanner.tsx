import { useEffect, useState } from "react";
import { loadAnalytics, readConsent, saveConsent } from "@/lib/consent";

export default function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const current = readConsent();
    if (current === "granted") void loadAnalytics();
    if (current === null) setOpen(true);

    const reopen = () => setOpen(true);
    window.addEventListener("kaba:consent-open", reopen);
    return () => window.removeEventListener("kaba:consent-open", reopen);
  }, []);

  if (!open) return null;

  const choose = (value: "granted" | "denied") => {
    saveConsent(value);
    if (value === "granted") void loadAnalytics();
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Analytics choice"
      className="fixed inset-x-4 bottom-4 z-[60] max-w-[420px] rounded-2xl border border-line-2 bg-panel p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] sm:inset-x-auto sm:left-6 sm:bottom-6"
    >
      <p className="label-mono">Your privacy choice</p>
      <p className="mt-3 text-[14px] leading-relaxed text-chalk-soft">
        Google Analytics counts visits and LogRocket records anonymised sessions so we can fix what is confusing.
        Neither loads until you choose, and form fields are never recorded.{" "}
        <a href="/privacy/" className="link-underline text-chalk">
          How we use your data
        </a>
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => choose("denied")} className="btn-quiet min-h-[44px] !px-3 !text-[13.5px]">
          Keep them off
        </button>
        <button type="button" onClick={() => choose("granted")} className="btn-solid min-h-[44px] !px-3 !text-[13.5px]">
          Allow analytics
        </button>
      </div>
    </div>
  );
}
