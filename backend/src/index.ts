import express from "express";
import { rateLimiter } from "./rate-limiter/rateLimiter.js";

const app = express();
const PORT = 3001;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/limited", rateLimiter, (_req, res) => {
  res.json({ message: "request allowed" });
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
