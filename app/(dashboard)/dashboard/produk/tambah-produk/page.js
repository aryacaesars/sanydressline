"use client";

import { Button } from "@/components/ui/button";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import AddProduct from "@/components/dashboard/Product/Add-Product";

export default function Tambah() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  if (isLoading) return <div>Loading...</div>;

  return isAuthenticated ? (
    <div className="flex flex-col items-center justify-center h-screen">
      Admin content
      <div>
        <AddProduct />
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
