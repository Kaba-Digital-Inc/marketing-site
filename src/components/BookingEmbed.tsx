import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";

export default function BookingEmbed() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("inline", {
        elementOrSelector: "#cal-inline",
        calLink: "kaba-digital-inc/30min",
        config: { layout: "month_view" },
      });
      cal("ui", {
        theme: "dark",
        styles: { branding: { brandColor: "#35d6f5" } },
        hideEventTypeDetails: false,
      });
    })();
  }, []);

  return <div id="cal-inline" className="h-[620px] w-full" />;
}
