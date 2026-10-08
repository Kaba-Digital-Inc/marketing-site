import { useEffect, useState } from "react";
import BookingEmbed from "@/components/BookingEmbed";
import ContactForm from "@/components/ContactForm";

type Tab = "call" | "message";

const options: { id: Tab; kicker: string; title: string; body: string; meta: string }[] = [
  { id: "call", kicker: "Option 1 · Paid enquiry call", title: "Book a 30-minute call", body: "A paid call ($80). Pick a slot and bring your questions. The price shows again when you book.", meta: "See open times" },
  { id: "message", kicker: "Option 2 · Free", title: "Send a message", body: "A few lines is enough. We reply within one business day.", meta: "Open the form" },
];

/** Both ways in stay visible as two choices; the one picked opens below at full width. */
export default function ContactChooser() {
  const [tab, setTab] = useState<Tab>("call");
  const [calSeen, setCalSeen] = useState(true);

  useEffect(() => {
    if (window.location.hash === "#message") setTab("message");
  }, []);
  const pick = (t: Tab) => {
    setTab(t);
    if (t === "call") setCalSeen(true);
    try { history.replaceState(null, "", t === "message" ? "#message" : "#book"); } catch { /* ignore */ }
  };

  return (
    <div>
      <div role="tablist" aria-label="How would you like to start?" className="grid gap-4 sm:grid-cols-2">
        {options.map((o) => {
          const on = tab === o.id;
          return (
            <button
              key={o.id}
              role="tab"
              id={`tab-${o.id}`}
              aria-selected={on}
              aria-controls={`panel-${o.id}`}
              type="button"
              onClick={() => pick(o.id)}
              className={`group rounded-2xl border p-6 text-left transition-colors sm:p-7 ${
                on ? "border-signal/50 bg-signal/[0.06]" : "border-line bg-panel-2 hover:border-line-2"
              }`}
            >
              <span className="label-mono">{o.kicker}</span>
              <span className="mt-3 block font-display text-[22px] font-semibold text-ink">{o.title}</span>
              <span className="mt-2 block text-[15px] leading-relaxed text-ink-mute">{o.body}</span>
              <span className={`mt-4 inline-flex items-center gap-2 text-[14px] font-medium ${on ? "text-signal" : "text-ink-soft"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${on ? "bg-signal" : "bg-ink-mute"}`} />
                {on ? "Open below" : o.meta}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-[14px] leading-relaxed text-ink-mute">
        Applying for a startup partnership? Skip the booking and use the{" "}
        <a href="/startups/#apply" className="link-underline text-ink">application</a> instead.
      </p>

      <div className="mt-6">
        <div
          role="tabpanel"
          id="panel-call"
          aria-labelledby="tab-call"
          hidden={tab !== "call"}
          className="overflow-hidden rounded-2xl border border-line bg-panel-2"
        >
          {calSeen && <BookingEmbed />}
        </div>
        <div
          role="tabpanel"
          id="panel-message"
          aria-labelledby="tab-message"
          hidden={tab !== "message"}
          className="mx-auto max-w-[780px] rounded-2xl border border-line bg-panel-2 p-7 sm:p-9"
        >
          <h2 className="font-display text-[24px] font-semibold text-ink">Tell us about the project</h2>
          <p className="mt-2 text-[15px] text-ink-mute">A few lines is enough to start.</p>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
