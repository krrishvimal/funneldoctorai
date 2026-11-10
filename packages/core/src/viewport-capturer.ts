export interface ViewportCaptureResult {
  url: string;
  screenshotBase64: string | null;
  mimeType: string;
  source: "live_cloud" | "synthetic_fallback";
  width: number;
  height: number;
}

/**
 * Capture a real mobile viewport screenshot of a given URL for multimodal vision reasoning.
 * Viewport: 393 x 852 px (standard iPhone 15 Pro / Android Pixel 7).
 */
export async function captureMobileViewport(
  targetUrl: string,
  timeoutMs = 7000
): Promise<ViewportCaptureResult> {
  let normalizedUrl = targetUrl.trim();
  if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Call high-speed, zero-config mobile viewport screenshot API
    const apiUrl = `https://api.microlink.io?url=${encodeURIComponent(
      normalizedUrl
    )}&screenshot=true&meta=false&viewport.width=393&viewport.height=852&viewport.isMobile=true&viewport.hasTouch=true`;

    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const screenshotUrl = data?.data?.screenshot?.url;

      if (screenshotUrl) {
        // Fetch the raw screenshot image and convert to base64
        const imgController = new AbortController();
        const imgTimeoutId = setTimeout(() => imgController.abort(), 4000);
        const imgRes = await fetch(screenshotUrl, { signal: imgController.signal });
        clearTimeout(imgTimeoutId);

        if (imgRes.ok) {
          const buffer = await imgRes.arrayBuffer();
          const base64Data = Buffer.from(buffer).toString("base64");
          return {
            url: normalizedUrl,
            screenshotBase64: base64Data,
            mimeType: "image/png",
            source: "live_cloud",
            width: 393,
            height: 852,
          };
        }
      }
    }
  } catch {
    clearTimeout(timeoutId);
  }

  // Fallback: If network times out, site is private, or blocked by captcha
  return {
    url: normalizedUrl,
    screenshotBase64: null,
    mimeType: "image/png",
    source: "synthetic_fallback",
    width: 393,
    height: 852,
  };
}
