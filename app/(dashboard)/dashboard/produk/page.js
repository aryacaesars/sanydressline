"use client";

import { Button } from "@/components/ui/button";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Product from "@/components/dashboard/Product/Product";

export default function AdminProduk() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  if (isLoading) return <div>Loading...</div>;

  return isAuthenticated ? (
    <div className="flex flex-col items-center justify-center h-screen">
      Admin content
      <div>
        <Product />
      </div>
      <Button>
        <LogoutLink>Sign out</LogoutLink>
      </Button>
    </div>
  ) : (
    <div>
      You have to <LoginLink>Login</LoginLink> to see this page
    </div>
  );
}
