import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const GA4_IDS: Record<string, string> = {
  // Manasum Prod
  "manasum-relycrm.reverely.ai": "G-SNSNRJMZ7Y",

  // Manasum UAT
  "demo.manasum.crm.reverely.ai": "G-3KTTX5CES0",

  // MIPS CRM - DEV
  "relycrm.reverely.ai": "G-035WCHG1Y4",
};

const getModule = (pathname: string): string | null => {
  if (!pathname) return null;
  const path = pathname.toLowerCase();

  if (path === "/" || path.startsWith("/dashboard")) {
    return "dashboard";
  }

  if (path.startsWith("/login")) {
    return "login";
  }

  if (path.startsWith("/channel-partner")) {
    return "channel_partner";
  }

  if (path.startsWith("/meta-ads-templates")) {
    return "meta_ads";
  }

  if (path.startsWith("/post-sales")) {
    return "post_sales";
  }

  if (path.startsWith("/leads") || path.startsWith("/lead")) {
    return "leads";
  }

  if (path.startsWith("/enquiries") || path.startsWith("/enquiry")) {
    return "enquiries";
  }

  if (path.startsWith("/deals") || path.startsWith("/deal")) {
    return "deals";
  }

  if (path.startsWith("/whatsapp-manager") || path.startsWith("/whatsapp")) {
    return "whatsapp";
  }

  if (
    path.startsWith("/properties") ||
    path.startsWith("/property") ||
    path.startsWith("/realestate")
  ) {
    return "properties";
  }

  if (path.startsWith("/collection")) {
    return "collections";
  }

  if (path.startsWith("/quotations-drive")) {
    return "drive";
  }

  if (path.startsWith("/quotations") || path.startsWith("/quotation")) {
    return "quotations";
  }

  if (path.startsWith("/calendar")) {
    return "calendar";
  }

  if (path.startsWith("/campaigns")) {
    return "broadcast";
  }

  if (path.startsWith("/call-logs") || path.startsWith("/calllogs")) {
    return "call_logs";
  }

  if (path.startsWith("/reports")) {
    return "reports";
  }

  if (path.startsWith("/onboard")) {
    return "onboard";
  }

  if (path.startsWith("/profile")) {
    return "profile";
  }

  if (
    path.startsWith("/settings") ||
    path.startsWith("/email-config") ||
    path.startsWith("/sales-stages") ||
    path.startsWith("/table-config") ||
    path.startsWith("/custom-tag") ||
    path.startsWith("/projects-config") ||
    path.startsWith("/channel-partners-config") ||
    path.startsWith("/routing-rules") ||
    path.startsWith("/rbac") ||
    path.startsWith("/meta-ads-templates") ||
    path.startsWith("/whatsapp-templates") ||
    path.startsWith("/instagram-messages") ||
    path.startsWith("/lead-capture-forms") ||
    path.startsWith("/track-sources") ||
    path.startsWith("/campaign-tracking") ||
    path.startsWith("/facebook-connect") ||
    path.startsWith("/feature-amenities")
  ) {
    return "settings";
  }

  if (path.startsWith("/followups")) {
    return "followups";
  }

  if (path.endsWith("-approvals") || path.includes("approval")) {
    return "approvals";
  }

  if (path.startsWith("/walking-form")) {
    return "walking_form";
  }

  return null;
};

export const initGA4 = (measurementId: string) => {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  try {
    if (!document.querySelector("[data-ga4-script]")) {
      window.dataLayer = window.dataLayer || [];

      window.gtag = function () {
        window.dataLayer.push(arguments);
      };

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.setAttribute("data-ga4-script", "true");

      document.head.appendChild(script);

      window.gtag("js", new Date());

      window.gtag("config", measurementId, {
        send_page_view: false,
      });
    }
  } catch (err) {
    console.error("GA4 init error:", err);
  }
};

export const trackEvent = (
  eventName: string,
  params: Record<string, unknown> = {}
) => {
  if (typeof window === "undefined") return;

  const hostname = window.location.hostname;
  const measurementId = GA4_IDS[hostname];
  if (!measurementId) return;

  if (typeof window.gtag !== "function") {
    initGA4(measurementId);
  }

  try {
    window.gtag("event", eventName, params);
  } catch (err) {
    console.error("GA4 trackEvent error:", err);
  }
};

export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    try {
      const hostname = window.location.hostname;
      const measurementId = GA4_IDS[hostname];

      if (!measurementId) {
        return;
      }

      initGA4(measurementId);

      const module = getModule(location.pathname);

      // Fire standard page_view so GA4 registers Realtime Active Users & session_start
      window.gtag("event", "page_view", {
        page_path: location.pathname,
        page_location: window.location.href,
        module: module || "other",
      });

      if (!module) return;

      window.gtag("event", "module_view", {
        module,
        page_path: location.pathname,
      });
    } catch (err) {
      console.error("Analytics component error:", err);
    }
  }, [location.pathname]);

  return null;
}
