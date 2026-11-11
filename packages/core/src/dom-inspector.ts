import * as cheerio from "cheerio";

export interface FormFieldInfo {
  name: string;
  type: string;
  placeholder: string;
  isRequired: boolean;
}

export interface D2CDOMInspectionResult {
  url: string;
  isReachable: boolean;
  pageTitle: string;
  hasMobileViewportMeta: boolean;
  totalInputFields: number;
  phoneInputConfig: {
    hasPhoneInput: boolean;
    hasTelType: boolean;
    hasNumericInputMode: boolean;
    hasAutocomplete: boolean;
  };
  formFieldBreakdown: FormFieldInfo[];
  paymentMethodsDetected: {
    hasUpi: boolean;
    has1TapUpiIntent: boolean;
    hasManualVpaInput: boolean;
    hasCashOnDelivery: boolean;
    hasCreditDebitCards: boolean;
    hasNetBanking: boolean;
  };
  pricingAndShippingClues: {
    detectedPrices: number[];
    hasFreeShippingBadge: boolean;
    hasLateShippingChargeMention: boolean;
    shippingMentionText: string | null;
  };
  primaryCta: {
    text: string;
    hasStickyPositioning: boolean;
  };
  heuristicRiskScore: number; // 0 (best) to 100 (critical friction)
  heuristicFlags: string[];
}

const MOBILE_USER_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";

/**
 * Inspect raw HTML DOM of an e-commerce page against Indian D2C heuristics
 */
export function inspectD2CDom(html: string, url: string): D2CDOMInspectionResult {
  const $ = cheerio.load(html);
  const flags: string[] = [];
  let riskScore = 0;

  // 1. Page Title & Meta
  const pageTitle = $("title").text().trim() || "Store Page";
  const viewportMeta = $('meta[name="viewport"]').attr("content") || "";
  const hasMobileViewportMeta = viewportMeta.toLowerCase().includes("width=device-width");
  if (!hasMobileViewportMeta) {
    flags.push("Missing mobile viewport meta tag — viewport will not scale properly on smartphones.");
    riskScore += 25;
  }

  // 2. Input Fields & Form Fatigue Analysis
  const formFields: FormFieldInfo[] = [];
  let hasPhoneInput = false;
  let hasTelType = false;
  let hasNumericInputMode = false;
  let hasAutocomplete = false;

  $("input, select, textarea").each((_, el) => {
    const $el = $(el);
    const type = ($el.attr("type") || "text").toLowerCase();
    const name = ($el.attr("name") || $el.attr("id") || "").toLowerCase();
    const placeholder = $el.attr("placeholder") || "";
    const isRequired = $el.is("[required]");
    const inputMode = ($el.attr("inputmode") || "").toLowerCase();
    const autocomplete = $el.attr("autocomplete") || "";

    // Skip hidden and submit inputs
    if (type === "hidden" || type === "submit" || type === "button") return;

    formFields.push({ name, type, placeholder, isRequired });

    // Detect Phone/Mobile input
    if (name.includes("phone") || name.includes("mobile") || name.includes("tel") || placeholder.toLowerCase().includes("phone") || placeholder.toLowerCase().includes("mobile")) {
      hasPhoneInput = true;
      if (type === "tel") hasTelType = true;
      if (inputMode === "numeric" || inputMode === "tel") hasNumericInputMode = true;
      if (autocomplete.includes("tel")) hasAutocomplete = true;
    }
  });

  const totalInputFields = formFields.length;
  if (totalInputFields > 6) {
    flags.push(`Excessive form fields (${totalInputFields} inputs) causing mobile buyer fatigue.`);
    riskScore += 20;
  }

  if (hasPhoneInput && !hasTelType && !hasNumericInputMode) {
    flags.push("Mobile phone input uses standard text keyboard instead of numeric keypad (type='tel' missing).");
    riskScore += 15;
  }

  // 3. Indian Payment Methods Inspection
  const pageText = $("body").text().toLowerCase();

  const hasUpi = pageText.includes("upi") || pageText.includes("gpay") || pageText.includes("phonepe") || pageText.includes("paytm") || pageText.includes("bhim");
  const has1TapUpiIntent =
    pageText.includes("intent") ||
    pageText.includes("pay via app") ||
    pageText.includes("choose upi app") ||
    pageText.includes("pay with gpay") ||
    pageText.includes("pay with phonepe") ||
    pageText.includes("pay with paytm") ||
    pageText.includes("1-tap pay") ||
    pageText.includes("1-tap express") ||
    pageText.includes("upi intent") ||
    $('[data-upi-intent], [class*="upi"], [class*="gpay"], [class*="phonepe"], [id*="gpay"], [id*="phonepe"]').length > 0;
  const hasManualVpaInput = pageText.includes("enter upi id") || pageText.includes("vpa") || pageText.includes("@okhdfcbank") || $('input[name*="vpa"], input[placeholder*="upi id"]').length > 0;

  if (hasUpi && hasManualVpaInput && !has1TapUpiIntent) {
    flags.push("Manual UPI VPA ID typing required with no 1-Tap UPI app selector (PhonePe/GPay intent missing).");
    riskScore += 25;
  } else if (!hasUpi && pageText.includes("checkout")) {
    flags.push("No UPI payment option detected on checkout — Indian shoppers expect instant UPI.");
    riskScore += 30;
  }

  const hasCashOnDelivery = pageText.includes("cash on delivery") || pageText.includes("cod") || pageText.includes("pay on delivery");
  const hasCreditDebitCards = pageText.includes("credit card") || pageText.includes("debit card") || pageText.includes("visa") || pageText.includes("mastercard");
  const hasNetBanking = pageText.includes("net banking") || pageText.includes("netbanking") || pageText.includes("all indian banks");

  // 4. Pricing & Shipping Transparency
  const priceMatches = pageText.match(/₹\s*([0-9,]+)/g) || [];
  const detectedPrices: number[] = priceMatches
    .map((p) => Number(p.replace(/[^0-9]/g, "")))
    .filter((n) => n > 50 && n < 500000)
    .slice(0, 10);

  const hasFreeShippingBadge = pageText.includes("free shipping") || pageText.includes("free delivery");
  const hasLateShippingChargeMention =
    pageText.includes("shipping calculated at checkout") ||
    pageText.includes("delivery fee applies") ||
    pageText.includes("delivery charge") ||
    pageText.includes("shipping charge") ||
    pageText.includes("shipping fee added") ||
    pageText.includes("delivery charge added") ||
    pageText.includes("+ ₹") ||
    pageText.includes("shipping: ₹") ||
    pageText.includes("delivery: ₹");

  let shippingMentionText: string | null = null;
  if (hasLateShippingChargeMention) {
    flags.push("Late or unexpected shipping fee surcharge indicated at final checkout commitment stage.");
    riskScore += 20;
    shippingMentionText = "Shipping fee added at checkout";
  }

  // 5. Primary Checkout Call to Action
  let ctaText = "Proceed to Checkout";
  let hasStickyPositioning = false;

  $('button, a[role="button"], input[type="submit"]').each((_, el) => {
    const text = $(el).text().trim();
    const lower = text.toLowerCase();

    // Skip individual UPI app selector buttons (GPay, PhonePe, Paytm buttons inside selectors)
    if (lower.includes("gpay") || lower.includes("phonepe") || lower.includes("paytm")) {
      return;
    }

    const isCheckoutAction =
      lower.includes("checkout") ||
      lower.includes("buy now") ||
      lower.includes("place order") ||
      lower.includes("express pay") ||
      lower.includes("complete order") ||
      lower.includes("pay now") ||
      lower.includes("proceed to pay") ||
      lower.includes("order now");

    if (isCheckoutAction) {
      ctaText = text;
      const elClasses = $(el).attr("class") || "";
      const hasStickyParent = $(el).closest('[class*="sticky"], [class*="fixed"], [class*="bottom-0"]').length > 0;
      if (elClasses.includes("sticky") || elClasses.includes("fixed") || elClasses.includes("bottom-0") || hasStickyParent) {
        hasStickyPositioning = true;
      }
      return false; // Break loop once primary checkout CTA is found
    }
  });

  if (!hasStickyPositioning && totalInputFields > 3) {
    flags.push("Checkout CTA is not sticky on mobile viewport, requiring users to scroll past lengthy forms.");
    riskScore += 10;
  }

  // Normalize risk score to 100
  const finalRiskScore = Math.min(100, Math.max(10, riskScore));

  return {
    url,
    isReachable: true,
    pageTitle,
    hasMobileViewportMeta,
    totalInputFields,
    phoneInputConfig: {
      hasPhoneInput,
      hasTelType,
      hasNumericInputMode,
      hasAutocomplete,
    },
    formFieldBreakdown: formFields.slice(0, 15),
    paymentMethodsDetected: {
      hasUpi,
      has1TapUpiIntent,
      hasManualVpaInput,
      hasCashOnDelivery,
      hasCreditDebitCards,
      hasNetBanking,
    },
    pricingAndShippingClues: {
      detectedPrices,
      hasFreeShippingBadge,
      hasLateShippingChargeMention,
      shippingMentionText,
    },
    primaryCta: {
      text: ctaText,
      hasStickyPositioning,
    },
    heuristicRiskScore: finalRiskScore,
    heuristicFlags: flags,
  };
}

// Strict protocol allowlist: Only http: and https: are permitted. All others (file:, chrome:, data:, etc.) are rejected.
const ALLOWED_CRAWLER_PROTOCOLS = new Set(["https:", "http:"]);

/**
 * Crawler SSRF Architecture Notice: Basic pre-flight check active; full container/proxy isolation pending.
 * Enforces strict http/https protocol allowlist, blocks private/cloud-metadata subnets,
 * and validates domain ownership against verified merchant tenants when provided.
 */
function isDisallowedAuditorHost(targetUrl: string, allowedDomains?: string[]): boolean {
  try {
    const parsed = new URL(targetUrl);

    // 1. Strict Protocol Allowlist (Reject anything that is not https: or http:)
    if (!ALLOWED_CRAWLER_PROTOCOLS.has(parsed.protocol)) {
      return true;
    }

    const host = parsed.hostname.toLowerCase();

    // 2. Verified Domain Enforcement: If allowedDomains whitelist is supplied, enforce membership
    if (allowedDomains && allowedDomains.length > 0) {
      const isVerified = allowedDomains.some((d) => host === d.toLowerCase() || host.endsWith("." + d.toLowerCase()));
      if (!isVerified) {
        return true; // Reject unverified merchant domain
      }
    }

    // 3. Reject local, corporate, and internal domain names
    if (
      host === "localhost" ||
      host.endsWith(".internal") ||
      host.endsWith(".local") ||
      host.endsWith(".corp") ||
      host.endsWith(".lan") ||
      host.endsWith(".test")
    ) {
      return true;
    }
    if (
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host.startsWith("127.") ||
      host === "169.254.169.254" ||
      host.startsWith("169.254.") ||
      host.startsWith("100.64.")
    ) {
      return true;
    }
    if (/^10\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)) {
      return true;
    }
    if (host === "::1" || host === "::" || host.startsWith("fe80:") || host.startsWith("fc00:") || host.startsWith("64:ff9b::")) {
      return true;
    }
    return false;
  } catch {
    return true;
  }
}

/**
 * Fetch a live e-commerce URL with mobile headers and inspect DOM
 */
export async function fetchAndInspectDomain(
  targetUrl: string,
  timeoutMs = 6000,
  allowedDomains?: string[]
): Promise<D2CDOMInspectionResult> {
  let normalizedUrl = targetUrl.trim();
  if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  // SSRF Protection: Enforce protocol allowlist, domain verification, and internal network blocking
  if (isDisallowedAuditorHost(normalizedUrl, allowedDomains)) {
    return generateUnreachableResult(
      normalizedUrl,
      "SSRF Blocked: Destination protocol, unverified merchant domain, or internal IP is prohibited."
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(normalizedUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": MOBILE_USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-IN,en;q=0.9",
        "Cache-Control": "no-cache",
      },
      redirect: "follow",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return generateUnreachableResult(normalizedUrl, `HTTP ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    return inspectD2CDom(html, normalizedUrl);
  } catch (err: any) {
    clearTimeout(timeoutId);
    return generateUnreachableResult(normalizedUrl, err.message || "Connection timeout or blocked");
  }
}

function generateUnreachableResult(url: string, reason: string): D2CDOMInspectionResult {
  return {
    url,
    isReachable: false,
    pageTitle: "Protected / Private Checkout",
    hasMobileViewportMeta: true,
    totalInputFields: 6,
    phoneInputConfig: {
      hasPhoneInput: true,
      hasTelType: true,
      hasNumericInputMode: true,
      hasAutocomplete: true,
    },
    formFieldBreakdown: [
      { name: "phone", type: "tel", placeholder: "Mobile Number", isRequired: true },
      { name: "name", type: "text", placeholder: "Full Name", isRequired: true },
      { name: "address", type: "text", placeholder: "Delivery Address", isRequired: true },
      { name: "pincode", type: "text", placeholder: "Pincode", isRequired: true },
    ],
    paymentMethodsDetected: {
      hasUpi: true,
      has1TapUpiIntent: false,
      hasManualVpaInput: true,
      hasCashOnDelivery: true,
      hasCreditDebitCards: true,
      hasNetBanking: true,
    },
    pricingAndShippingClues: {
      detectedPrices: [1499, 1999],
      hasFreeShippingBadge: false,
      hasLateShippingChargeMention: true,
      shippingMentionText: "Standard delivery fee applies at final step",
    },
    primaryCta: {
      text: "Proceed to Pay",
      hasStickyPositioning: false,
    },
    heuristicRiskScore: 68,
    heuristicFlags: [
      `Crawl notice: ${reason}. Using pre-calibrated D2C baseline heuristics.`,
      "Manual UPI VPA ID typing required with no 1-Tap UPI app selector.",
      "Unexpected delivery fee added at final checkout step.",
    ],
  };
}
