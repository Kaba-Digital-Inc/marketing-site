import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

type Props = { currentPath?: string };

type MenuItem = { label: string; href: string; note: string };
type Menu = { label: string; href: string; items: MenuItem[] };

const menus: Menu[] = [
  {
    label: "Services",
    href: "/services",
    items: [
      { label: "AI strategy", href: "/services", note: "Where AI pays off, and what it takes" },
      { label: "Agents & workflows", href: "/services", note: "Systems that do real work" },
      { label: "Retrieval & knowledge", href: "/services", note: "Answers from your own data" },
      { label: "AI product engineering", href: "/services", note: "Interface through inference" },
    ],
  },
  {
    label: "Cloudflare",
    href: "/cloudflare",
    items: [
      { label: "Platform engineering", href: "/cloudflare", note: "Workers, R2, D1, Vectorize" },
      { label: "Zero Trust", href: "/cloudflare", note: "Access, Gateway, tunnels" },
      { label: "Managed operations", href: "/cloudflare", note: "We run the account for you" },
      { label: "The full catalog", href: "/cloudflare", note: "Everything we build with" },
    ],
  },
  {
    label: "Work",
    href: "/work",
    items: [
      { label: "ClawBuilders.club", href: "/work", note: "Agent evaluation arena" },
      { label: "OffloadVault", href: "/work", note: "Gallery on your own storage" },
      { label: "Client engagements", href: "/work", note: "The work behind NDAs" },
    ],
  },
  {
    label: "Studio",
    href: "/about",
    items: [
      { label: "About us", href: "/about", note: "A small, direct studio" },
      { label: "How we work", href: "/services", note: "Scope, prove, build, operate" },
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

export default function SiteNav({ currentPath = "/" }: Props) {
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
        <a href="/" className="flex items-center gap-2.5" aria-label={`${site.name} home`}>
          <Mark />
          <span className="font-display text-[17px] font-semibold tracking-tight text-chalk">
            Kaba Digital
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
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-[13.5px] text-chalk-soft transition-colors hover:border-line-2 hover:text-chalk"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.34c-2.23.48-2.7-1.07-2.7-1.07-.36-.93-.89-1.18-.89-1.18-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.13 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.11.16 1.93.08 2.13.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            <span>Our open work</span>
          </a>
          <a href="/contact" className="btn-quiet">
            Contact
          </a>
          <a href="/contact" className="btn-solid">
            Start building
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
          <nav className="shell flex flex-col py-2" aria-label="Mobile">
            {menus.map((menu) => (
              <a
                key={menu.label}
                href={menu.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-3.5 text-[15px] text-chalk-soft last:border-0"
              >
                {menu.label}
              </a>
            ))}
            <a href="/contact" onClick={() => setOpen(false)} className="btn-solid my-4">
              Start building
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}