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
              className="relative w-[76px] h-auto aspect-square rounded-none"
            >
              <Link href="/">
                <Image
                  fill
                  priority
                  alt="HEOSL Logo"
                  src="/heosl_logo.jpg"
                  className="object-contain object-left-top"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
