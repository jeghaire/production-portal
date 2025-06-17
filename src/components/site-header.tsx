"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { logOut } from "@/lib/actions";
import { IconLogout2 } from "@tabler/icons-react";
import { ModeToggle } from "./mode-toggle";
import { cn } from "@/lib/utils";

export function LogOutButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <form action={logOut}>
      <Button
        variant="ghost"
        size="icon"
        className={cn("size-7", className)}
        {...props}
      >
        <IconLogout2 className="-translate-x-0.5" />
        <span className="sr-only">Log Out</span>
      </Button>
    </form>
  );
}

export function SiteHeader({ title = "PRODUCTION DATA" }: { title?: string }) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium uppercase">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4"
          />
          <LogOutButton />
        </div>
      </div>
    </header>
  );
}
