"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

import { sidebarLinks } from "@/constants";

const NavLinks = () => {
  const pathname = usePathname();

  return (
    <SidebarMenu className="sidebar-menu-layout">
      {sidebarLinks.map((item) => {
        const isActive = pathname === item.url;
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              className={`sidebar-menu-button ${
                isActive ? "sidebar-menu-button-active" : ""
              }`}
            >
              <Link href={item.url} className="flex items-center gap-3 p-3">
                <item.icon
                  className={`h-5 w-5 ${
                    isActive ? "text-red-300" : "text-red-400"
                  }`}
                />
                <span className={`font-medium ${isActive ? "text-white" : ""}`}>
                  {item.title}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

export default NavLinks;
