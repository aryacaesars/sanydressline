import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export default withAuth(
  async function middleware(req) {
  },
  {
    isReturnToCurrentPage: false,
    loginPage: "/login",
  }
);;

export const config = {
  matcher: ["/dashboard/:path*"],
};