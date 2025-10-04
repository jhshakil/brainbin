import {
  ClipboardList,
  LayoutDashboard,
  LayoutList,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import NavMain from "./NavMain";
import NavUser from "./NavUser";
import SidebarLogo from "./SidebarLogo";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "All Tasks",
      url: "/all-tasks",
      icon: LayoutList,
    },
    {
      title: "My Tasks",
      url: "/my-tasks",
      icon: ClipboardList,
    },

    {
      title: "Team Members",
      url: "/team-members",
      icon: Users,
    },
  ],
};

const AppSidebar = (props: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
