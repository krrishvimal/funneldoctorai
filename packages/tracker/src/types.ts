/**
 * @funneldoctor/tracker - Core Event Types
 */

export type TelemetryEventType =
  | "field_dwell"
  | "field_error"
  | "rage_click"
  | "step_view"
  | "abandonment";

export interface TelemetryEvent {
  type: TelemetryEventType;
  target: string;
  dwellMs?: number;
  metadata?: Record<string, string | number | boolean>;
  timestamp: number;
}

export interface TelemetryViewport {
  width: number;
  height: number;
  isMobile: boolean;
  userAgent?: string;
}

export interface TelemetryBatch {
  siteId: string;
  sessionId: string;
  url: string;
  viewport: TelemetryViewport;
  events: TelemetryEvent[];
  sentAt: number;
  merchantKey?: string;
}

export interface FunnelDoctorTrackerOptions {
  siteId: string;
  merchantKey?: string;
  endpoint?: string;
  batchIntervalMs?: number;
  maxBatchSize?: number;
  debug?: boolean;
  onKillSwitch?: () => void;
}
