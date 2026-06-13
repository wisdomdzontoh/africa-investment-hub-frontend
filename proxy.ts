import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  "/(en|fr|zh)/investor(.*)",
  // Renamed from `project-owner` to `facilitator` (RENAME-02); the matcher
  // must track the live route or these pages lose server-side auth.
  "/(en|fr|zh)/facilitator(.*)",
  "/(en|fr|zh)/admin(.*)",
  "/(en|fr|zh)/onboarding(.*)",
  "/(en|fr|zh)/pending-approval(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
  return intlMiddleware(request);
});

export const config = {
  matcher: [
    // Exclude `monitoring` so the Sentry tunnel route (next.config tunnelRoute)
    // isn't rewritten with a locale prefix.
    "/((?!_next|monitoring|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
