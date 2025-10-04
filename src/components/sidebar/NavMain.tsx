import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router";
import { cn } from "@/lib/utils";

type Props = {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
};

const NavMain = ({ items }: Props) => {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <NavLink to={item.url}>
              {({ isActive }) => (
                <SidebarMenuButton
                  tooltip={item.title}
                  className={cn(
                    "cursor-pointer flex items-center gap-2 hover:bg-primary hover:text-white",
                    isActive ? "bg-primary text-white" : ""
                  )}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavMain;
