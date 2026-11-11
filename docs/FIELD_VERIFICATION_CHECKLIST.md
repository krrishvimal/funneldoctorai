# 📋 FunnelDoctor AI: Field Verification Protocol & Device Lab Workbook

> **Usage:** Fill this workbook in during **Milestone 2 kickoff** when deploying to a live development store and testing across physical Android and iOS devices. Record what actually happens, including any edge-case failures.

---

## Part 1: Shopify Dev-Store Verification Checklist

### Setup Record
| Item | Configured Value / Environment |
| :--- | :--- |
| **Dev Store Domain** | `[Pending Milestone 2 Store Deployment]` |
| **Shopify Plan** | Development Store (Partner Sandbox) |
| **Theme & Version** | Dawn (v15.0.0) / Impact / Prestige |
| **Tracker Version & SRI Hash** | `v1.0.4` (`sha384-xsi1CrDRxInIfUNB3NbLKxS+UP6YULzNNRaVehyj+TNEKR00E6p78hYQmLLGO1KC`) |
| **Web Pixel Version** | Customer Events API (`v1.0.4`) |
| **Shopify API Version Used** | `2026-10` (`process.env.SHOPIFY_API_VERSION`) |
| **Test Gateway** | Bogus Gateway / Razorpay Test Mode / Cashfree Sandbox |
| **Tester & Date** | `[Tester Name]` / `[Date]` |

---

### A. Storefront Tracker (DOM Inspection & PII Safety)
| ID | Step | Expected Result | Actual Result | Pass / Fail | Evidence / Log Ref |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **DS-01** | Add tracker script tag with SRI hash to theme | Script loads, no SRI digest error, zero console errors | `[Pending M2 Run]` | ⏳ | Network 200 OK |
| **DS-02** | Browse store and watch ingest endpoint | Beacons arrive with correct `siteId` | `[Pending M2 Run]` | ⏳ | Ingest payload |
| **DS-03** | Send event with unregistered `siteId` | Request rejected with `403 Forbidden` | `[Pending M2 Run]` | ⏳ | Response code |
| **DS-04** | Block ingest endpoint in browser (simulate offline) | Storefront functions normally, zero broken UI | `[Pending M2 Run]` | ⏳ | Console log |
| **DS-05** | Engage kill switch remotely via config | Tracker detaches listeners, ceases sending beacons | `[Pending M2 Run]` | ⏳ | Network panel |
| **DS-06** | Type into name, phone, email, and pincode fields | Dwell time and validation metadata recorded only | `[Pending M2 Run]` | ⏳ | Payload inspect |
| **DS-07** | Inspect network payload for those fields | Zero raw field contents captured in any payload | `[Pending M2 Run]` | ⏳ | Zero PII payload |
| **DS-08** | Test `pin_code`, `pincode`, and `postal-code` inputs | All tracked as legitimate postal fields | `[Pending M2 Run]` | ⏳ | Dwell tracked |
| **DS-09** | Test password, card number, CVV, and OTP fields | Immediate deny; no events recorded whatsoever | `[Pending M2 Run]` | ⏳ | Zero touch |

---

### B. Cart & Quick Checkout Link Permalinks
| ID | Step | Expected Result | Actual Result | Pass / Fail | Evidence / Log Ref |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **DS-10** | Add an item to cart | `_fd_vid` is populated in cart attributes via `/cart.js` | `[Pending M2 Run]` | ⏳ | `/cart.js` attributes |
| **DS-11** | Add/remove items in cart drawer, click Quick Checkout | Dynamic permalink reflects live cart line items | `[Pending M2 Run]` | ⏳ | URL slug |
| **DS-12** | Load with UTMs, `gclid`, unknown param, and `fd_var` | Only allowlisted params carried; `fd_var` ignored | `[Pending M2 Run]` | ⏳ | Target URL |
| **DS-13** | Open permalink in a different browser session | Cart rebuilt with SKUs; `_fd_vid` survives via permalink attribute | `[Pending M2 Run]` | ⏳ | Cross-browser cart |
| **DS-14** | Check discount code and cart notes | Record preserved fields vs lost attributes | `[Pending M2 Run]` | ⏳ | Checkout state |
| **DS-15** | Click Quick Checkout before cart update completes | Handled gracefully without runtime error | `[Pending M2 Run]` | ⏳ | Console inspect |

---

### C. Web Pixels & Checkout Extensibility
| ID | Step | Expected Result | Actual Result | Pass / Fail | Evidence / Log Ref |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **DS-16** | Start checkout | `checkout_started` fires; record payload fields | `[Pending M2 Run]` | ⏳ | Web Worker log |
| **DS-17** | Submit contact info | `checkout_contact_info_submitted` fires | `[Pending M2 Run]` | ⏳ | Web Worker log |
| **DS-18** | Submit address | `checkout_address_info_submitted` fires | `[Pending M2 Run]` | ⏳ | Web Worker log |
| **DS-19** | Choose shipping rate | `checkout_shipping_info_submitted` fires | `[Pending M2 Run]` | ⏳ | Web Worker log |
| **DS-20** | Submit payment info | `payment_info_submitted` fires | `[Pending M2 Run]` | ⏳ | Web Worker log |
| **DS-21** | Complete the order | `checkout_completed` fires | `[Pending M2 Run]` | ⏳ | Web Worker log |
| **DS-22** | Read `checkout.attributes` in pixel | `_fd_vid` found as key-value array entry | `[Pending M2 Run]` | ⏳ | Array find result |
| **DS-23** | Customer declines tracking consent | Zero beacons dispatched; pixel drops telemetry | `[Pending M2 Run]` | ⏳ | Privacy API status |
| **DS-24** | Inspect finished order in Shopify Admin | Verify whether `_fd_vid` appears in order notes | `[Pending M2 Run]` | ⏳ | Admin order view |
| **DS-25** | Same user across two browsers completes one order | De-duplicated accurately by Order ID | `[Pending M2 Run]` | ⏳ | Ingest DB record |

---

### D. Experiments & APIs
| ID | Step | Expected Result | Actual Result | Pass / Fail | Evidence / Log Ref |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **DS-26** | Load page and inspect variant assignment | Deterministic variant allocated from `_fd_vid`; stable on reload | `[Pending M2 Run]` | ⏳ | Variant state |
| **DS-27** | Delay variant server response beyond 50ms | Fails closed to `CONTROL`, logged as timeout metric | `[Pending M2 Run]` | ⏳ | Timeout log |
| **DS-28** | Call Draft Orders API with active version (`2026-10`) | Succeeds on supported quarterly API version | `[Pending M2 Run]` | ⏳ | API 200 OK |
| **DS-29** | Pass old version (`2024-01`) in environment | Deprecation warning raised automatically | `[Pending M2 Run]` | ⏳ | Logger warning |

---

## Part 2: Real-Device Physical Test Lab

### Hardware Lab Matrix
| Device Model | OS & Build | Instagram App | Chrome / Safari | Installed UPI Apps | Connectivity | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **Samsung Galaxy S23** | Android 14 (OneUI 6.0) | v320.0 | Chrome v124 | PhonePe, GPay, Paytm | 5G / Jio | 🟡 M2 Ready |
| **Google Pixel 7** | Android 14 (Stock) | v320.0 | Chrome v124 | GPay, BHIM | Wi-Fi 6 | 🟡 M2 Ready |
| **OnePlus 11** | Android 13 (OxygenOS) | v318.0 | Chrome v123 | PhonePe, Paytm | 5G / Airtel | 🟡 M2 Ready |
| **iPhone 14 Pro** | iOS 17.4 | v320.0 | Mobile Safari | GPay, PhonePe, Cred | 5G / Airtel | 🟡 M2 Ready |
| **iPhone 13** | iOS 16.6 | v315.0 | Mobile Safari | PhonePe, Apple Pay | Wi-Fi | 🟡 M2 Ready |

---

### Physical Flows to Execute
| Flow ID | Scenario | Expected Behavior | Actual Behavior | Pass / Fail | Observations |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **RD-01** | Android Instagram: Choose UPI Intent | Opens selected UPI app native sheet; order reconciles | `[Pending Device Run]` | ⏳ | App switch speed |
| **RD-02** | Android Instagram: Chrome Breakout | `intent://...` opens external Chrome browser with cart | `[Pending Device Run]` | ⏳ | No blank white screen |
| **RD-03** | Android: Chrome Breakout with Chrome Disabled | Fallback URL (`S.browser_fallback_url`) opens default browser | `[Pending Device Run]` | ⏳ | Fallback URL load |
| **RD-04** | Cart Round Trip: Instagram $\rightarrow$ Chrome | Line items, quantities, and `_fd_vid` preserved | `[Pending Device Run]` | ⏳ | Full cart restored |
| **RD-05** | iPhone Instagram: Safari Guidance Modal | Clear 3-step modal displays; link copies to clipboard | `[Pending Device Run]` | ⏳ | UI clarity & copy |
| **RD-06** | iPhone Safari: Direct Visit | Standard Quick Checkout link functions smoothly | `[Pending Device Run]` | ⏳ | Smooth transition |
| **RD-07** | Shopper Cancels/Declines Inside UPI App | Returns to storefront with secondary payment options | `[Pending Device Run]` | ⏳ | Cards/COD fallback |
| **RD-08** | No UPI App Installed on Phone | Secondary checkout options (Card 3DS, Netbanking, COD) displayed | `[Pending Device Run]` | ⏳ | No dead-end crash |
| **RD-09** | Return from UPI App to Storefront | Webhook marks payment; order success screen displays | `[Pending Device Run]` | ⏳ | No duplicate billing |
| **RD-10** | Throttled 2G / Slow Network | Tracker fails silently without blocking page interactions | `[Pending Device Run]` | ⏳ | Zero main-thread lag |
| **RD-11** | Numeric Keypad on Phone & Pincode | Native numeric keypad triggers for phone & pincode | `[Pending Device Run]` | ⏳ | Keypad layout |
| **RD-12** | Sticky CTA Button on Small Screen | CTA stays visible above fold; does not obscure inputs | `[Pending Device Run]` | ⏳ | Viewport spacing |
| **RD-13** | General Checkout Jank & FPS | 60fps scrolling; zero stutter from telemetry listeners | `[Pending Device Run]` | ⏳ | Smooth interaction |
