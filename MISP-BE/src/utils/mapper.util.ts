// Helpers for translating between frontend record shapes and TypeORM entity columns.

export const parseJsonArray = (raw?: string | null): any[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

// YYYY-MM-DD in plant-local time (matches the data source timezone)
export const datePart = (value: any): string => {
  if (!value) return "";
  const d = new Date(value);
  return isNaN(d.getTime()) ? String(value) : d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
};

export const dateTimeLabel = (value: any): string => {
  if (!value) return "";
  const d = new Date(value);
  return isNaN(d.getTime()) ? String(value) : d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
};

// MySQL DATE columns reject '' and locale strings in strict mode
export const toSqlDate = (value: any): string | null => {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : datePart(d);
};

// Client ids like `led-<timestamp>-<uuid>` can exceed the varchar(36) primary key; let the DB generate one
export const withSafeId = (entity: any, id: any) => {
  if (typeof id === "string" && id.length > 0 && id.length <= 36) entity.id = id;
  return entity;
};

export const num = (value: any, fallback = 0): number => {
  const n = Number(value);
  return isNaN(n) ? fallback : n;
};
