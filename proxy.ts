import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  "/(en|fr|zh)/investor(.*)",
  "/(en|fr|zh)/project-owner(.*)",
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
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
