// components/app-sidebar.jsx
"use client";

import * as React from "react";
import {
  HomeIcon,
  DocumentTextIcon,
  ChartPieIcon,
  PlusIcon,
  ListBulletIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

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
        logo: HomeIcon,
        plan: "Enterprise",
      },
    ],
    navMain: [
      {
        title: "Product",
        url: "/dashboard/product",
        icon: DocumentTextIcon,
        isActive: true,
        items: [
          {
            title: "Add Product",
            url: "/dashboard/product/add",
            icon: PlusIcon,
          },
          {
            title: "List Product",
            url: "/dashboard/product/list",
            icon: ListBulletIcon,
          },
          {
            title: "Update Product",
            url: "/dashboard/product/update",
            icon: PencilSquareIcon,
          },
          {
            title: "Delete Product",
            url: "/dashboard/product/delete",
            icon: TrashIcon,
          },
        ],
      },
      {
        title: "Page Content",
        url: "/dashboard/page-content",
        icon: DocumentTextIcon,
        items: [
          {
            title: "Add Content",
            url: "/dashboard/page-content/add",
            icon: PlusIcon,
          },
          {
            title: "List Content",
            url: "/dashboard/page-content/list",
            icon: ListBulletIcon,
          },
        ],
      },
      {
        title: "Category",
        url: "/dashboard/category",
        icon: ChartPieIcon,
        items: [
          {
            title: "Add Category",
            url: "/dashboard/category/add",
            icon: PlusIcon,
          },
          {
            title: "List Category",
            url: "/dashboard/category/list",
            icon: ListBulletIcon,
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