import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export default withAuth(
  async function middleware(req) {
    console.log("User data:", req.kindeAuth);
  },
  {
    isReturnToCurrentPage: false,
    loginPage: "/login",
  }
);;

export const config = {
  matcher: ["/dashboard/:path*"],
};