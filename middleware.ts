import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const publicRoutes = ["/signout", "/signin", "/api/test"];

// 1. Specify protected and public routes
export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;

  if (publicRoutes.includes(path)) {
    // Allow public routes to be accessed without authentication
    return NextResponse.next();
  }

  // 3. Get the session
  const userID = (await cookies()).get("userID")?.value;

  // 4. Redirect to /login if the user is not authenticated
  if (!userID) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }

  // 5. Allow the request to continue if the user is authenticated
  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
