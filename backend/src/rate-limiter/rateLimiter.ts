/* ## 1. Rate limiter middleware

> Write Express middleware that limits each IP to **5 requests per 60 seconds**.

**Requirements**

- Track requests per IP in memory (a `Map` is fine)
- Under the limit: let the request through with `next()`
- Over the limit: return **429 Too Many Requests** with a JSON error
- Include a `Retry-After` header with the seconds until they can try again
- Apply it to a test route like `GET /limited`

**Test:**

```bash
for i in {1..6}; do curl -i http://localhost:3001/limited; echo; done */

import type { Request, Response, NextFunction } from "express";
const LIMIT = 5;
const WINDOW_MS = 60_000;

type Entry = {
  count: number;
  windowStart: number;
};

// save ip and entry count so it can also reset when server restarts

const requests = new Map<string, Entry>();

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip ?? "unknown";
  const now = Date.now();

  // TODO: look up the IP in the map
  const entry = requests.get(ip);

  // TODO: first request, or window expired -> start a fresh window and allow

  if (entry === undefined || now - entry.windowStart > WINDOW_MS) {
    requests.set(ip, { count: 1, windowStart: now });
    // next() passes the request to the route and stops this function. code below will only run when ip is still inside the window
    return next();
  }

  // TODO: still inside the window -> increment the count
  entry.count++;
  // TODO: over the limit -> set Retry-After and return 429

  if (entry.count <= LIMIT) {
    // round up so the client never retries before the window actually resets
    const retryAfterSeconds = Math.ceil((entry.windowStart + WINDOW_MS - now) / 1000);
    res.set("Retry-After", String(retryAfterSeconds));
    return res.status(429).json({
      error: "Too many requests",
      retryAfterSeconds,
    });
  }

  // TODO: under the limit -> allow
  return next();
};
