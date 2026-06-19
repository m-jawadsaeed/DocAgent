import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerRoutes from "./routes/swagger.routes.js";
import swaggerUi from "swagger-ui-express";
import healthRoutes from "./routes/health.routes.js";
import routes from "./routes/index.js";
import chatRoutes from "./routes/chat.routes.js";
import { swaggerSpec } from "./config/swagger.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/notFound.middleware.js";
import compression from "compression";

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use("/api", swaggerRoutes);
app.use(
  compression({
    filter: (req, res) => {
      if (req.headers.accept === "text/event-stream") {
        return false;
      }

      return compression.filter(req, res);
    },
  }),
);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,

    credentials: true,
  }),
);

app.use(helmet());

app.use(express.json());
app.use("/api", healthRoutes);
app.use(morgan("dev"));
app.use("/api/chat", chatRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// http://localhost:5000/api/docs
app.use("/api", routes);

app.use(notFoundMiddleware);

app.use(errorHandler);

export default app;
