const host = process.env.HOST;
const port = Number(process.env.PORT);
const corsOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const ACTIVE_ORDER_STATUSES = new Set(["menunggu", "berlangsung"]);
const CLOSED_ORDER_STATUSES = new Set(["selesai", "dibatalkan", "ditolak"]);

export { host, port, corsOrigins, ACTIVE_ORDER_STATUSES, CLOSED_ORDER_STATUSES };
