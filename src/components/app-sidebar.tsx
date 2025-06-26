"use client";

import React, { Suspense } from "react";
import {
  IconHelp,
  IconSearch,
  IconSettings,
  IconBuildingFactory,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
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
              className="relative w-[76px] h-auto aspect-[154/135] rounded-none"
            >
              <Link href="/">
                <Image
                  src="/heosl_logo.png"
                  alt=""
                  fill
                  className="object-contain object-left-top"
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
      </SidebarContent>
    </Sidebar>
  );
}
