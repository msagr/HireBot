import authConfig from "./auth.config";
import NextAuth from "next-auth";

import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicRoutes,
} from "./routes";

const { auth } = NextAuth(authConfig);
// const BASE_PATH = "/auth";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
  
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname); // e.g. /auth/login
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  
    if (isApiAuthRoute) return null;
  
    // If logged in, block access to login/register
    if (isAuthRoute && isLoggedIn) {
      if (nextUrl.pathname === DEFAULT_LOGIN_REDIRECT || nextUrl.pathname === "/auth/register" || nextUrl.pathname === "/auth/error") {
        return null; // prevent self-redirect loop
      }
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
    }
  
    // If not logged in, block access to private routes
    if (!isLoggedIn && !isPublicRoute) {
      if (nextUrl.pathname === "/auth/login" || nextUrl.pathname === "/auth/register" || nextUrl.pathname === "/auth/error") {
        return null; // prevent loop
      }
      return Response.redirect(new URL("/auth/login", req.url));
    }
  
    return null;
  });

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}