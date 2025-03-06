export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

const loginPage = "/api/auth/signin";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.redirect(new URL(loginPage, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/homePage", "/api/verifyAccount:path*"],
};
