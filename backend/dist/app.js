import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import appRouter from './routes/index.js';
import transcribeRouter from './routes/transcribe.js'; // Import the transcribe route
import cookieParser from 'cookie-parser';
import cors from "cors";
config(); // Load environment variables
const app = express();
// Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
// Logging for development
app.use(morgan("dev"));
// Use the routes
app.use("/api/v1", appRouter);
app.use("/api/v1", transcribeRouter);
// app.use('/public', express.static(path.join(__dirname, 'backend\public\check.mp3')));
export default app;
//# sourceMappingURL=app.js.map