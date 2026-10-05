const KEY = "kaba-analytics-consent";
const GA_ID = "G-EY38M8ZEBX";
const LOGROCKET_ID = "mp0ois/kaba-digital-inc";

export type Consent = "granted" | "denied" | null;

export function readConsent(): Consent {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function saveConsent(value: "granted" | "denied") {
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    /* storage can be blocked; the choice then applies to this page view only */
  }
}

let loaded = false;

/** Loads Google Analytics and LogRocket. Call only after consent is granted. */
export async function loadAnalytics() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }
  gtag("js", new Date());
  gtag("config", GA_ID);

  const { default: LogRocket } = await import("logrocket");
  // Mask every form field so contact details are never recorded in a session replay.
  LogRocket.init(LOGROCKET_ID, { dom: { inputSanitizer: true } });
}
