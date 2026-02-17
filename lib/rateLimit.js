// In-memory rate limiter for API routes
// For production with multiple instances, replace with Redis-based solution

const attempts = new Map()

/**
 * @param {string} key - Unique identifier (e.g. IP + endpoint)
 * @param {number} maxAttempts - Max requests allowed in the window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {{ limited: boolean, remaining: number, retryAfterMs: number }}
 */
export function rateLimit(key, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now()
  const record = attempts.get(key)

  if (!record || now - record.startedAt > windowMs) {
    attempts.set(key, { count: 1, startedAt: now })
    return { limited: false, remaining: maxAttempts - 1, retryAfterMs: 0 }
  }

  record.count += 1

  if (record.count > maxAttempts) {
    const retryAfterMs = windowMs - (now - record.startedAt)
    return { limited: true, remaining: 0, retryAfterMs }
  }

  return { limited: false, remaining: maxAttempts - record.count, retryAfterMs: 0 }
}

/**
 * Helper to extract a client identifier from a Next.js request
 */
export function getClientIp(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}
