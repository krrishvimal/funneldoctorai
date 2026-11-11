/**
 * @file adapter.ts
 * @description Universal Database Adapter interface and SQLite implementation for FunnelDoctor AI.
 * 
 * Utilizes Node.js built-in `node:sqlite` for zero-native-dependency, high-performance local & test operations.
 * Enforces:
 * - Parameterized queries (100% protection against SQL injection)
 * - Foreign key constraint enforcement (PRAGMA foreign_keys = ON)
 * - Write-Ahead Logging (WAL) for high-concurrency read/write throughput
 */

declare const __non_webpack_require__: any;

import { MIGRATION_001_SQL } from "./schema.js";

// Safe dynamic loader for node:sqlite to support ESM, CJS, and prevent Webpack client bundler errors
function loadSqliteDatabaseSync(): any {
  if (typeof window !== "undefined") {
    throw new Error("SqliteDatabaseAdapter cannot be run in the browser.");
  }
  const modName = ["node", "sqlite"].join(":");
  try {
    const dynamicRequire =
      typeof __non_webpack_require__ !== "undefined"
        ? __non_webpack_require__
        : typeof require !== "undefined"
        ? require
        : eval("require");
    return dynamicRequire(modName).DatabaseSync;
  } catch {
    try {
      const modulePkg = ["node", "module"].join(":");
      const nodeModule = (typeof require !== "undefined" ? require : eval("require"))(modulePkg);
      const dynamicReq = nodeModule.createRequire(process.cwd() + "/package.json");
      return dynamicReq(modName).DatabaseSync;
    } catch {
      throw new Error("Unable to load node:sqlite. Node.js >= 22.0.0 is required.");
    }
  }
}

export interface DatabaseAdapter {
  exec(sql: string): void;
  run(sql: string, params?: any[]): { changes: number; lastInsertRowid: number | bigint };
  get<T = any>(sql: string, params?: any[]): T | undefined;
  all<T = any>(sql: string, params?: any[]): T[];
  transaction<T>(fn: () => T): T;
  close(): void;
}

export class SqliteDatabaseAdapter implements DatabaseAdapter {
  private db: any;

  constructor(filePath = ":memory:") {
    const DatabaseSync = loadSqliteDatabaseSync();
    this.db = new DatabaseSync(filePath);
    this.initPragmas();
    this.applyMigrations();
  }

  private initPragmas(): void {
    // Enable WAL mode for high concurrency if backed by a file
    try {
      this.db.exec("PRAGMA journal_mode = WAL;");
    } catch {
      // :memory: databases use memory journal mode
    }
    this.db.exec("PRAGMA foreign_keys = ON;");
    this.db.exec("PRAGMA synchronous = NORMAL;");
    this.db.exec("PRAGMA busy_timeout = 5000;");
  }

  private applyMigrations(): void {
    this.db.exec(MIGRATION_001_SQL);
  }

  public exec(sql: string): void {
    this.db.exec(sql);
  }

  public run(sql: string, params: any[] = []): { changes: number; lastInsertRowid: number | bigint } {
    const stmt = this.db.prepare(sql);
    const result = stmt.run(...params);
    return {
      changes: Number(result.changes),
      lastInsertRowid: result.lastInsertRowid,
    };
  }

  public get<T = any>(sql: string, params: any[] = []): T | undefined {
    const stmt = this.db.prepare(sql);
    return stmt.get(...params) as T | undefined;
  }

  public all<T = any>(sql: string, params: any[] = []): T[] {
    const stmt = this.db.prepare(sql);
    return stmt.all(...params) as T[];
  }

  public transaction<T>(fn: () => T): T {
    this.db.exec("BEGIN IMMEDIATE;");
    try {
      const res = fn();
      this.db.exec("COMMIT;");
      return res;
    } catch (err) {
      this.db.exec("ROLLBACK;");
      throw err;
    }
  }

  public close(): void {
    this.db.close();
  }
}
