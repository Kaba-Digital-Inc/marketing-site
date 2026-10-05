import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const interests = [
  "AI strategy and scoping",
  "Agents and workflow automation",
  "AI product engineering",
  "Cloudflare engineering",
  "Managed Cloudflare operations",
  "Something else",
];

const fieldClass =
  "h-11 rounded-lg border-line bg-panel-2 text-ink placeholder:text-ink-mute/70 focus-visible:border-ultra focus-visible:ring-1 focus-visible:ring-ultra";

export default function ContactForm() {
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
      <div className="grid gap-5 sm:grid-cols-2">
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

      <div className="grid gap-5 sm:grid-cols-2">
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
          placeholder="The workflow or product you have in mind, your current stack, and any timeline."
          className="rounded-lg border-line bg-panel-2 text-ink placeholder:text-ink-mute/70 focus-visible:border-ultra focus-visible:ring-1 focus-visible:ring-ultra"
        />
      </div>

      <button type="submit" disabled={submitting} className="btn-solid w-full disabled:opacity-60">
        {submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
