import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Explicitly list protected routes
const isProtectedRoute = createRouteMatcher([
  "/generate-program(.*)", 
  "/profile(.*)"
])

// Explicitly list public routes that should never be protected
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)"
])

export default clerkMiddleware(async (auth, req) => {
  // Never protect public routes
  if (isPublicRoute(req)) return;
  
  // Only protect specific routes
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Do not match Clerk's auth routes explicitly
    // Note: matcher entries are inclusive; our isProtectedRoute guards only specific paths.
  ],
}