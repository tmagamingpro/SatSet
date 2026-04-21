import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { node } from "@elysiajs/node";
import "dotenv/config";
import { corsOrigins, host, port } from "./config.js";
import { createAppDependencies } from "./deps.js";
import { registerSystemRoutes } from "./routes/systemRoutes.js";
import { registerAuthRoutes } from "./routes/authRoutes.js";
import { registerUserRoutes } from "./routes/userRoutes.js";
import { registerOrderRoutes } from "./routes/orderRoutes.js";
import { registerChatRoutes } from "./routes/chatRoutes.js";
import { registerNotificationRoutes } from "./routes/notificationRoutes.js";
import { registerReportRoutes } from "./routes/reportRoutes.js";
import { registerPortfolioRoutes } from "./routes/portfolioRoutes.js";

const deps = createAppDependencies();

let app = new Elysia({ adapter: node() }).use(
  cors({
    origin: corsOrigins.length ? corsOrigins : true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);

app = app.onError(({ error, code, set }) => {
  if (code === "NOT_FOUND") {
    set.status = 404;
    return { message: "Endpoint tidak ditemukan." };
  }

  set.status = 500;
  return { message: error?.message || "Terjadi kesalahan server." };
});

app = registerSystemRoutes(app, deps);
app = registerAuthRoutes(app, deps);
app = registerUserRoutes(app, deps);
app = registerOrderRoutes(app, deps);
app = registerChatRoutes(app, deps);
app = registerNotificationRoutes(app, deps);
app = registerReportRoutes(app, deps);
app = registerPortfolioRoutes(app, deps);

app.listen({ hostname: host, port });

console.log(`Link Start "pakai gaya kirito" di ${host}:${port}`);
