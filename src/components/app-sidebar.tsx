"use client";

import React, { Suspense } from "react";
import {
  IconHelp,
  IconSearch,
  IconSettings,
  IconBuildingFactory,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Filter, FilterFallback } from "@/components/filters";
import Image from "next/image";
import Link from "next/link";

const data = {
  user: {
    name: "Praise Eghaire",
    email: "Praise.Eghaire@HEOSL.com",
    avatar: "/mavi.jpeg",
  },
  navMain: [
    {
      title: "Production",
      url: "/dashboard",
      icon: IconBuildingFactory,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 h-16 w-full"
            >
              <Link href="/">
                <Image
                  src="/heosl_logo.png"
                  alt=""
                  width={65}
                  height={65}
                  className="aspect-square "
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <SidebarGroup className="group-data-[collapsible=icon]:hidden mb-6">
          <SidebarGroupLabel>Filters</SidebarGroupLabel>
          <SidebarMenu></SidebarMenu>
          <Suspense fallback={<FilterFallback />}>
            <Filter />
          </Suspense>
        </SidebarGroup>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
