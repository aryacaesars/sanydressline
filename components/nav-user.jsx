"use client";

import { LogOut } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();

  if (isLoading) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    return null; // or a message indicating the user is not authenticated
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.picture} alt={user.given_name} />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.given_name} {user.family_name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <LogoutLink className="w-full flex items-center justify-center">
          <LogOut className="mr-2" />
          Log out
        </LogoutLink>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}