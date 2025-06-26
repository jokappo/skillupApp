"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { Book } from "lucide-react";
import { Compass } from "lucide-react";
import { PencilRuler } from "lucide-react";
import { WalletMinimal } from "lucide-react";
import { UserCircle2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AddNewCourseDialogue from "./AddNewCourseDialogue";

const SidebarOptions = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/workspace",
  },
  {
    title: "My Learning",
    icon: Book,
    path: "/workspace/my-courses",
  },
  {
    title: "Explore Courses",
    icon: Compass,
    path: "/workspace/explore",
  },
  {
    title: "AI Tools",
    icon: PencilRuler,
    path: "/workspace/ai-tools",
  },
  {
    title: "Billing",
    icon: WalletMinimal,
    path: "/workspace/billing",
  },
  {
    title: "Profile",
    icon: UserCircle2Icon,
    path: "/workspace/profile",
  },
];

function AppSidebar() {
  const path = usePathname();
  return (
    <Sidebar>
      <SidebarHeader className=" p-4">
        <Image src={"/logo.svg"} alt="logo" width={120} height={120} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <AddNewCourseDialogue>
            <Button size={"full"} >Create New Cours</Button>
          </AddNewCourseDialogue>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {SidebarOptions.map((option, index) => (
                <SidebarMenuItem key={option.title + index}>
                  <SidebarMenuButton asChild className="p-5">
                    <Link
                      href={option.path}
                      className={`text-[17px]
                        ${
                          path.includes(option.path) &&
                          "text-primary bg-purple-50"
                        }`}
                    >
                      <option.icon className="mr-2 h-7 w-7 font-bold" />
                      <span>{option.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

export default AppSidebar;
