// components/app-sidebar.jsx
"use client";

import * as React from "react";
import {
  Bot,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }) {


  const data = {
    teams: [
      {
        name: "Sanydressline",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
    ],
    navMain: [
      {
        title: "Page Content",
        url: "/dashboard/page-content",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "Add Content",
            url: "/dashboard/page-content/add",
          },
          {
            title: "List Content",
            url: "/dashboard/page-content/list",
          },
        ],
      },
      {
        title: "Product",
        url: "/dashboard/product",
        icon: Bot,
        items: [
          {
            title: "Add Product",
            url: "/dashboard/product/add",
          },
          {
            title: "List Product",
            url: "/dashboard/product/list",
          },
          {
            title: "Update Product",
            url: "/dashboard/product/update",
          },
          {
            title: "Delete Product",
            url: "/dashboard/product/delete",
          },
        ],
      },
      {
        title: "Category",
        url: "/dashboard/category",
        icon: PieChart,
        items: [
          {
            title: "Add Category",
            url: "/dashboard/category/add",
          },
          {
            title: "List Category",
            url: "/dashboard/category/list",
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}