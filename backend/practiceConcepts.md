# Backend Interview Exercises

Node + Express + TypeScript. Time-box each one, talk through decisions out loud, then practice the
follow-ups.

---

## 1. Rate limiter middleware

> Write Express middleware that limits each IP to **5 requests per 60 seconds**.

**Requirements**

- Track requests per IP in memory (a `Map` is fine)
- Under the limit: let the request through with `next()`
- Over the limit: return **429 Too Many Requests** with a JSON error
- Include a `Retry-After` header with the seconds until they can try again
- Apply it to a test route like `GET /limited`

**Test:**

```bash
for i in {1..6}; do curl -i http://localhost:3001/limited; echo; done
```

The first 5 return 200, the 6th returns 429.

**Follow-ups:** What happens to the `Map` after days with millions of IPs? What breaks with 3
servers behind a load balancer? What's the flaw with a fixed 60-second window, and how does a
sliding window fix it?

---

## 2. Cursor pagination endpoint

> Build `GET /posts?limit=10&cursor=...`.

**Requirements**

- Seed 100 posts. An in-memory array is fine at first; switch to Prisma later
- Return `{ items, nextCursor }`
- Sort by `createdAt` descending, with `id` as a tiebreaker so the order is stable
- `limit` defaults to 10 and maxes out at 50; reject invalid values with 400
- `nextCursor` is `null` on the last page

**Test:** Page through the posts, add a new post partway through, and confirm there are no
duplicates or skipped items.

**Follow-ups:** Why does offset pagination break here? What index does this query need? Why encode
the cursor, for example as base64?

---

## 3. Idempotency key middleware

> Build `POST /orders` that requires an `Idempotency-Key` header.

**Requirements**

- Missing key: **400**
- First request with a key creates the order, and the response is stored under that key
- Same key again: return the **stored response**, with no new order created
- Same key but a different body: **422**
- Same key while the first request is still processing: **409**
- Stored keys expire after 24 hours

**Test:** Send the same curl twice and confirm you get the same order ID and only one order exists.

**Follow-ups:** Where do keys live in production, Redis or the DB? What happens if the server
crashes mid-request?

---

## 4. Retry with exponential backoff

> Write `retry(fn, { retries: 3, baseDelayMs: 200 })` that returns a promise.

**Requirements**

- If `fn` throws, retry up to `retries` times
- The delay doubles each attempt (200, 400, 800ms), plus random jitter
- After the last attempt, throw the final error
- Support an optional `shouldRetry(err)` so errors like a 400 don't get retried

**Test:** Pass a fake function that fails twice and then succeeds, and log each attempt with a
timestamp.

**Follow-ups:** Why add jitter? Which errors should you retry, and which shouldn't you? Why do
retries require idempotency?

---

## 5. Auth middleware

> Build `POST /login` and a protected `GET /me`.

**Requirements**

- One hardcoded user with a **bcrypt-hashed** password
- `/login` checks credentials and returns a JWT that expires in 15 minutes
- `requireAuth` middleware reads `Authorization: Bearer <token>`, verifies it, and attaches the user
  to `req.user`
- Return **401** for a missing, invalid, or expired token
- `/me` returns the logged-in user
- Type `req.user` properly in TypeScript

**Follow-ups:** JWT vs. sessions? How do you log someone out when JWTs can't be revoked? Where
should the client store the token?
