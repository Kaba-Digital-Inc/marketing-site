import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

type WorkItem = { label: string; href: string; note: string };
type Props = { currentPath?: string; workItems?: WorkItem[] };

type MenuItem = { label: string; href: string; note: string };
type Menu = { label: string; href: string; items: MenuItem[] };

const baseMenus: Menu[] = [
  {
    label: "Who we help",
    href: "/startups",
    items: [
      { label: "Startups", href: "/startups", note: "Selective partnerships: paid plus equity" },
      { label: "Small & mid-sized business", href: "/ai-native", note: "Become AI-native, one workflow at a time" },
      { label: "Enterprise", href: "/enterprise", note: "Take pilots to production" },
      { label: "Investors & accelerators", href: "/investors", note: "Hands-on AI labs for portfolio teams" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    items: [
      { label: "AI strategy", href: "/services", note: "Where AI pays off, and what it takes" },
      { label: "AI agent development", href: "/services/ai-agent-development", note: "Systems that do real work" },
      { label: "AI automation", href: "/services/ai-automation", note: "Take repetitive work off your team" },
      { label: "AI workshops & labs", href: "/services/ai-workshops", note: "Hands-on training for your team" },
      { label: "Agents on Cloudflare", href: "/cloudflare", note: "Build, migrate, and run on the platform" },
      { label: "Voice & realtime agents", href: "/services", note: "Conversations that run 24/7" },
      { label: "Retrieval & knowledge", href: "/services", note: "Answers from your own data" },
      { label: "AI product engineering", href: "/services", note: "Interface through inference" },
    ],
  },
  {
    label: "Studio",
    href: "/about",
    items: [
      { label: "About us", href: "/about", note: "A small, direct studio" },
      { label: "Insights", href: "/insights", note: "Practical guides on AI for business" },
      { label: "Our technology", href: "/stack", note: "Model-agnostic, no lock-in" },
      { label: "Partners", href: "/partners", note: "Platforms we build on and ClawBuilders sponsors" },
      { label: "Where we work", href: "/locations", note: "Based in Toronto, working worldwide" },
      { label: "Contact", href: "/contact", note: "Start with a conversation" },
    ],
  },
];

function Mark() {
  return (
    <svg viewBox="0 0 28 28" className="h-7 w-7" aria-hidden="true">
      <rect x="1" y="1" width="26" height="26" rx="7" fill="#0e1012" stroke="#262b31" />
      <circle cx="9.5" cy="9.5" r="2.4" fill="#f2f4f6" />
      <circle cx="18.5" cy="14" r="2.4" fill="#35d6f5" />
      <circle cx="9.5" cy="18.5" r="2.4" fill="#f2f4f6" />
      <path d="M11.4 10.6 16.6 12.9M11.4 17.4 16.6 15.1" stroke="#f2f4f6" strokeWidth="1.1" opacity="0.5" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M2.5 4.5 6 8l3.5-3.5" />
    </svg>
  );
}

function buildMenus(workItems: WorkItem[]): Menu[] {
  const work: Menu = {
    label: "Work",
    href: "/work",
    items: [...workItems, { label: "All work", href: "/work", note: "Our products, partnerships, and client projects" }],
  };
  const out = [...baseMenus];
  out.splice(2, 0, work); // after Services, before Studio
  return out;
}

export default function SiteNav({ currentPath = "/", workItems = [] }: Props) {
  const menus = buildMenus(workItems);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const active = (href: string) =>
    href === "/" ? currentPath === "/" : currentPath.startsWith(href);

  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 140);
  };

  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "border-b border-line bg-void/85 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="shell flex h-[70px] items-center justify-between gap-6">
        <a href="/" className="flex min-h-[44px] items-center gap-2.5" aria-label={`${site.name} home`}>
          <Mark />
          <span className="font-display text-[17px] font-semibold tracking-tight text-chalk">
            Kaba Digital Inc.
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary" onMouseLeave={scheduleClose}>
          {menus.map((menu) => {
            const menuOpen = openMenu === menu.label;
            return (
              <div key={menu.label} className="relative" onMouseEnter={() => { cancelClose(); setOpenMenu(menu.label); }}>
                <a
                  href={menu.href}
                  aria-current={active(menu.href) ? "page" : undefined}
                  aria-expanded={menuOpen}
                  onFocus={() => setOpenMenu(menu.label)}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[15px] transition-colors ${
                    menuOpen || active(menu.href) ? "text-chalk" : "text-chalk-soft hover:text-chalk"
                  }`}
                >
                  {menu.label}
                  <span className={`transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}>
                    <Chevron />
                  </span>
                </a>

                {menuOpen && (
                  <div className="absolute left-0 top-full pt-3">
                    <div className="w-[330px] rounded-2xl border border-line bg-panel p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)]">
                      {menu.items.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          onClick={() => setOpenMenu(null)}
                          className="block rounded-xl px-3.5 py-3 transition-colors hover:bg-panel-2"
                        >
                          <span className="block text-[14.5px] font-medium text-chalk">{item.label}</span>
                          <span className="mt-0.5 block text-[13px] text-chalk-mute">{item.note}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href="/contact" className="btn-quiet">
            Contact
          </a>
          <a href="/contact/" className="btn-solid">
            Book a call
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-line text-chalk lg:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-void lg:hidden">
          <nav className="shell flex max-h-[calc(100dvh-70px)] flex-col overflow-y-auto py-2" aria-label="Mobile">
            {menus.map((menu) => (
              <div key={menu.label} className="border-b border-line py-3">
                <p className="label-mono px-0 pb-1 pt-2">{menu.label}</p>
                {menu.items.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={currentPath === item.href || currentPath === `${item.href}/` ? "page" : undefined}
                    className="flex min-h-[44px] items-center text-[16px] text-chalk-soft aria-[current=page]:text-chalk"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            ))}
            <a href="/contact/" onClick={() => setOpen(false)} className="btn-solid my-4">
              Book a call
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}