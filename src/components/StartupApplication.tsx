import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const stages = ["Pre-seed", "Seed", "Series A", "Series B or later", "Other"];

const fieldClass =
  "h-11 rounded-lg border-line bg-panel-2 text-ink placeholder:text-ink-mute/70 focus-visible:border-ultra focus-visible:ring-1 focus-visible:ring-ultra";
const areaClass =
  "rounded-lg border-line bg-panel-2 text-ink placeholder:text-ink-mute/70 focus-visible:border-ultra focus-visible:ring-1 focus-visible:ring-ultra";
const labelClass = "text-[13px] font-medium text-ink-mute";

const empty = {
  name: "",
  email: "",
  company: "",
  website: "",
  stage: stages[1],
  building: "",
  traction: "",
  whyAi: "",
  terms: "",
};

export default function StartupApplication() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState(empty);
  const [botcheck, setBotcheck] = useState(false);

  const update = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (botcheck) return; // honeypot: a person never ticks this hidden box
    setSubmitting(true);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "4a2c14ab-3913-4287-8cf6-d08aa5c2aaef",
          subject: `Startup partnership application: ${form.company || form.name}`,
          from_name: "Kaba Digital Inc. partnership application",
          to: "team@kabadigitalinc.com",
          name: form.name,
          email: form.email,
          company: form.company,
          website: form.website,
          stage: form.stage,
          building: form.building,
          traction: form.traction,
          why_ai_and_why_now: form.whyAi,
          expectations_on_cash_and_equity: form.terms,
        }),
      });
      if (!response.ok) throw new Error("Failed to send application");

      setSent(true);
      setForm(empty);
      toast({ title: "Application received", description: "Thank you. We read every application and will reply by email." });
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please email team@kabadigitalinc.com instead.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-line bg-panel-2 p-8" role="status">
        <p className="label-mono">Application received</p>
        <h3 className="mt-3 font-display text-[24px] font-semibold text-chalk">Thank you. We will be in touch.</h3>
        <p className="mt-3 text-[15.5px] leading-relaxed text-chalk-soft">
          We read every application. If it looks like a fit, we will reply to schedule an intro call.
        </p>
        <button type="button" onClick={() => setSent(false)} className="link-underline mt-6 min-h-[44px] text-[15px]">
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-label="Startup partnership application">
      <input
        type="checkbox"
        name="botcheck"
        checked={botcheck}
        onChange={(e) => setBotcheck(e.target.checked)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="app-name" className={labelClass}>Your name</Label>
          <Input id="app-name" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Founder name" className={fieldClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="app-email" className={labelClass}>Email</Label>
          <Input id="app-email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@startup.com" className={fieldClass} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="app-company" className={labelClass}>Startup</Label>
          <Input id="app-company" required value={form.company} onChange={(e) => update("company", e.target.value)} placeholder="Company name" className={fieldClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="app-website" className={labelClass}>Website or demo</Label>
          <Input id="app-website" value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="example.com" className={fieldClass} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="app-stage" className={labelClass}>Stage</Label>
        <select
          id="app-stage"
          value={form.stage}
          onChange={(e) => update("stage", e.target.value)}
          className="h-11 w-full rounded-lg border border-line bg-panel-2 px-3 text-[15px] text-ink outline-none focus:border-ultra"
        >
          {stages.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="app-building" className={labelClass}>What are you building, and for whom?</Label>
        <Textarea id="app-building" required rows={4} value={form.building} onChange={(e) => update("building", e.target.value)} placeholder="The product, the customer, and the problem it solves." className={areaClass} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="app-traction" className={labelClass}>Traction so far</Label>
        <Textarea id="app-traction" required rows={3} value={form.traction} onChange={(e) => update("traction", e.target.value)} placeholder="Users, revenue, pilots, funding, or what you have learned." className={areaClass} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="app-whyai" className={labelClass}>Why AI, and why now? Where are you stuck?</Label>
        <Textarea id="app-whyai" required rows={4} value={form.whyAi} onChange={(e) => update("whyAi", e.target.value)} placeholder="What the AI has to do well, and the hardest part today." className={areaClass} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="app-terms" className={labelClass}>What do you expect on fees and equity?</Label>
        <Textarea id="app-terms" rows={3} value={form.terms} onChange={(e) => update("terms", e.target.value)} placeholder="Our model is a fee plus a small equity stake. Tell us what works for your stage." className={areaClass} />
      </div>

      <button type="submit" disabled={submitting} className="btn-solid w-full disabled:opacity-60">
        {submitting ? "Sending…" : "Submit application"}
      </button>
      <p className="text-[12.5px] leading-relaxed text-ink-mute">
        We use this only to review your application. See our <a href="/privacy/" className="link-underline">privacy policy</a>.
      </p>
    </form>
  );
}
