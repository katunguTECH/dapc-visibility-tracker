export function safeObject<T>(obj: any, fallback: T): T {
  if (!obj || typeof obj !== "object") return fallback;
  return obj;
}

export function safeString(value: any, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  return value;
}

export function safeNumber(value: any, fallback = 0): number {
  if (typeof value !== "number" || isNaN(value)) return fallback;
  return value;
}

export function safeArray<T>(value: any, fallback: T[] = []): T[] {
  return Array.isArray(value) ? value : fallback;
}