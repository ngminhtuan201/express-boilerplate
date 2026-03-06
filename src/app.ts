import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import ExpressMongoSanitize from "express-mongo-sanitize";
import expressSession from "express-session";
import http from "http";
import passport from "passport";
import path from "path";
import winston from "winston";
import { config } from "./config";
import { connectToMongoDB, initRedis } from "./dbs";
import {
  logger,
  morganRequestFailedHandler,
  morganRequestSuccessHandler,
  passportGoogleStrategy,
  passportJWTStrategy,
} from "./libs";
import { handleResponseError } from "./middlewares";

// API routes
import { adminRouter } from "./modules/admin/admin.route";
import { authRouter } from "./modules/auth/auth.route";
import { uploadRouter } from "./modules/upload/upload.route";
import { paymentRouter } from "./modules/payments/payment.route";
import { healthRouter } from "./modules/health/health.route";

class ServerApp {
  private app: express.Application;
  private logger: winston.Logger;

  constructor() {
    this.app = express();
    this.logger = logger;
  }

  async config() {
    try {
      // TODO: Add origin domains
      // Cors
      const corsOrigins = ["http://localhost:3000"];
      this.app.use(cors({ origin: corsOrigins, credentials: true }));

      this.app.use(cookieParser());
      this.app.use(
        expressSession({
          secret: config.COOKIE_SECRET_KEY,
          saveUninitialized: true,
          resave: true,
        }),
      );
      this.app.use(express.urlencoded({ extended: true }));
      this.app.use(express.json());

      // Static files
      this.app.use(
        "/storages",
        express.static(path.join(__dirname, "../storages")),
      );

      // MongoDB
      this.logger.info("📦 [mongodb] Connecting...");
      await connectToMongoDB();
      this.logger.info("📦 [mongodb] Connection initialized successfully");

      // Redis
      this.logger.info("📦 [redis] Connecting...");
      initRedis();
      this.logger.info("📦 [redis] Connection initialized successfully");

      // MongoDB sanitize
      this.app.use(ExpressMongoSanitize());

      // Passport
      this.app.use(passport.initialize());
      passport.use(passportJWTStrategy);
      passport.use(passportGoogleStrategy);
      passport.serializeUser((user, done) => {
        done(null, user);
      });
      passport.deserializeUser((user, done) => {
        done(null, user);
      });

      // Request logger
      this.app.use(morganRequestSuccessHandler);
      this.app.use(morganRequestFailedHandler);

      // API routers
      const apiRoutes: Array<{ prefix: string; router: express.Router }> = [
        {
          prefix: "health",
          router: healthRouter,
        },
        {
          prefix: "auth",
          router: authRouter,
        },
        {
          prefix: "admin",
          router: adminRouter,
        },
        {
          prefix: "payments",
          router: paymentRouter,
        },
        {
          prefix: "upload",
          router: uploadRouter,
        },
      ];

      for (const route of apiRoutes) {
        this.app.use(`/api/${route.prefix}`, route.router);
      }

      this.logger.info("🌐 [server] Router initialized successfully");

      // Error handler
      this.app.use(handleResponseError);

      // Server
      const host = config.APP_HOST;
      const port = config.APP_PORT;
      const server = http.createServer(this.app);
      server.listen(port);

      this.logger.info(`⚡️ [server] Server is listening at ${host}:${port}`);

      this.logger.info(
        "🎉 [server] All initialization steps completed successfully",
      );
    } catch (error) {
      this.logger.info(`❌ [server] Server initialized failed\n${error}`);
    }
  }
}

let serverApp: ServerApp | undefined;

export const startServer = async (): Promise<void> => {
  serverApp = new ServerApp();
  await serverApp.config();
};
