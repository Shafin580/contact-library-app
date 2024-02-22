import { MANDATORY_COOKIES, parseCookieUserInfo } from "@app-context"
import { NextRequest, NextResponse } from "next/server"

export const config = {
  matcher: [
    "/:path*",
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    // "/((?!api|static|.*\\..*|_next).*)", // ! does not work as expected
  ],
}

/**
 * ! Do not change the sequence of code blocks in this file. The sequence is carefully
 * ! placed in terms of different scenarios that can occur. Changing the sequence can
 * ! break the logic.
 */

const EXCLUDE_ROUTES = [
  "/register",
  // * next.js api route
  "/api",
  // * next.js static routes & static files
  "/_next/static",
  "/_next/image",
  "/favicon.*",
  // * public routes
  "/img",
  "/icons",
  "/404",
  "/500",
  "/error",
]

// This function can be marked `async` if using `await` inside
export default function middleware(request: NextRequest) {
  const RESPONSE = NextResponse.next()
  const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL as string).replace("/external", "")
  const hasAllCookies = MANDATORY_COOKIES.every((cookie) => request.cookies.has(cookie))
  const currentURLPathname = new URL(request.url).pathname
  const regexFormat = EXCLUDE_ROUTES.map((item) => {
    return item.replace(/\//g, `\\/`)
  }).join("|")
  const regex = new RegExp(`^(${regexFormat}).*$`, "i")
  const excludeRoute = (request: NextRequest) => {
    return !request.nextUrl.pathname.match(regex)
  }

  // + user is not logged in and is routing to one of the protected page(s)
  if (!hasAllCookies && currentURLPathname !== "/" && excludeRoute(request)) {
    const response = NextResponse.redirect(SITE_URL)
    for (const cookie of MANDATORY_COOKIES) {
      response.cookies.delete(cookie)
    }
    return response
  }

  const userInfo = parseCookieUserInfo(request.cookies)

  // + user is logged in and is routing to the login page
  if (hasAllCookies && currentURLPathname === "/") {
    return NextResponse.redirect(SITE_URL + "contacts/list")
  }

  // Continue with the next middleware or handler
  return RESPONSE
}
