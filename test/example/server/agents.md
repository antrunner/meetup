# server/agents.md

## API contracts

### POST /api/login
- 200: { token: string, userId: string }
- 401: { error: "Invalid credentials" }
- 422: { errors: [{ field: string, message: string }] }
- 429: rate limited after 10 requests per minute

### Auth
- All protected routes: Authorization: Bearer <token>
- Token expiry: 1 hour
- Refresh: POST /api/refresh

## MSW rules
- Always intercept OPTIONS preflight for CORS routes
- Simulate Slow 3G with a 2000ms delay handler
- Use rest.post / rest.get (MSW v1) or http.post / http.get (MSW v2)

## §12 Test patterns (resolved failures)

### 2026-05-20 Login flow - Integration
- Problem: MSW handler missing OPTIONS preflight → CORS error in test
- Fix: add rest.options('/api/login', ...) handler before post handler
- Rule: always add OPTIONS handler for any route with a POST/PUT handler

### 2026-05-20 Login - Slow 3G skeleton
- Problem: skeleton asserted after await → already gone
- Fix: assert skeleton visibility BEFORE awaiting the response
- Rule: assert loading state before await, not after
