import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const interests = [
  "AI-Native Audit",
  "AI agent or automation project",
  "AI workshops and labs for a team",
  "Startup partnership (paid plus equity)",
  "Enterprise AI governance",
  "Investor or fund inquiry",
  "Something else",
];

/** A short pointer under the choice, for the options that have a better first step. */
const hints: Record<string, { text: string; href?: string; link?: string }> = {
  "Startup partnership (paid plus equity)": {
    text: "The fastest route is the short application, which tells us what we need to know.",
    href: "/startups/#apply",
    link: "Open the application",
  },
  "AI workshops and labs for a team": { text: "Tell us the team, the stack, and what they should learn. We scope a lab around it." },
  "Investor or fund inquiry": { text: "Tell us about the portfolio and what you would like teams to learn. Everything stays confidential." },
};

const placeholders: Record<string, string> = {
  "AI workshops and labs for a team": "Who attends, the stack they use, and what they should be able to do afterwards.",
  "Investor or fund inquiry": "Your portfolio, the stacks the teams use, and what you would like them to learn.",
  "Startup partnership (paid plus equity)": "What you are building, your stage, and where you want AI engineering help.",
};

const fieldClass =
  "h-11 rounded-lg border-line bg-panel-2 text-ink placeholder:text-ink-mute/70 focus-visible:border-ultra focus-visible:ring-1 focus-visible:ring-ultra";

export default function ContactForm({ compact = false }: { compact?: boolean }) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    interest: interests[0],
    message: "",
  });

  const update = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "4a2c14ab-3913-4287-8cf6-d08aa5c2aaef",
          name: form.name,
          email: form.email,
          company: form.company,
          interest: form.interest,
          message: form.message,
          subject: `New enquiry: ${form.interest}`,
          to: "team@kabadigitalinc.com",
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      toast({
        title: "Message sent",
        description: "Thanks. We will reply within one business day.",
      });
      setForm({ name: "", email: "", company: "", interest: interests[0], message: "" });
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

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className={`grid gap-5 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[13px] font-medium text-ink-mute">
            Name
          </Label>
          <Input
            id="name"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your name"
            className={fieldClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[13px] font-medium text-ink-mute">
            Work email
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@company.com"
            className={fieldClass}
          />
        </div>
      </div>

      <div className={`grid gap-5 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div className="space-y-2">
          <Label htmlFor="company" className="text-[13px] font-medium text-ink-mute">
            Company
          </Label>
          <Input
            id="company"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="Company name"
            className={fieldClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="interest" className="text-[13px] font-medium text-ink-mute">
            What do you need?
          </Label>
          <select
            id="interest"
            value={form.interest}
            onChange={(e) => update("interest", e.target.value)}
            className="h-11 w-full rounded-lg border border-line bg-panel-2 px-3 text-[15px] text-ink outline-none focus:border-ultra"
          >
            {interests.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {hints[form.interest] && (
            <p className="text-[13px] leading-relaxed text-ink-mute">
              {hints[form.interest].text}{" "}
              {hints[form.interest].href && (
                <a href={hints[form.interest].href} className="link-underline text-ink">
                  {hints[form.interest].link}
                </a>
              )}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-[13px] font-medium text-ink-mute">
          Project context
        </Label>
        <Textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder={placeholders[form.interest] ?? "The workflow or product you have in mind, your current stack, and any timeline."}
          className="rounded-lg border-line bg-panel-2 text-ink placeholder:text-ink-mute/70 focus-visible:border-ultra focus-visible:ring-1 focus-visible:ring-ultra"
        />
      </div>

      <button type="submit" disabled={submitting} className="btn-solid w-full disabled:opacity-60">
        {submitting ? "Sending…" : "Send message"}
      </button>
      <p className="text-center text-[12.5px] text-ink-mute">
        We reply within one business day and use your details only to answer you.{" "}
        <a href="/privacy/" className="link-underline">Privacy</a>
      </p>
    </form>
  );
}
