import { TelemetryEvent } from "./types.js";
import { sanitizeElementTarget } from "./pii-masker.js";

export interface RageClickCallback {
  (event: TelemetryEvent): void;
}

export class RageClickTracker {
  private clickHistory: { target: HTMLElement; time: number }[] = [];
  private readonly thresholdMs = 1000;
  private readonly thresholdCount = 3;
  private lastRageTime = 0;
  private onEvent: RageClickCallback;

  constructor(onEvent: RageClickCallback) {
    this.onEvent = onEvent;
  }

  public attach(root: Document | HTMLElement = document) {
    root.addEventListener("click", this.handleClick, true);
  }

  public detach(root: Document | HTMLElement = document) {
    root.removeEventListener("click", this.handleClick, true);
  }

  private handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target) return;

    const now = typeof performance !== "undefined" ? performance.now() : Date.now();

    // Prune history older than thresholdMs
    this.clickHistory = this.clickHistory.filter(
      (entry) => now - entry.time <= this.thresholdMs
    );

    this.clickHistory.push({ target, time: now });

    // Check how many clicks hit the same target or its closest button/container
    const matchCount = this.clickHistory.filter(
      (entry) => entry.target === target || entry.target.contains(target) || target.contains(entry.target)
    ).length;

    // Trigger rage click event if threshold met and cooldown passed (2s cooldown per element)
    if (matchCount >= this.thresholdCount && now - this.lastRageTime > 2000) {
      this.lastRageTime = now;
      this.onEvent({
        type: "rage_click",
        target: sanitizeElementTarget(target),
        metadata: {
          clickCount: matchCount,
          timeWindowMs: this.thresholdMs,
        },
        timestamp: Date.now(),
      });

      // Clear after firing to reset cluster
      this.clickHistory = [];
    }
  };
}
