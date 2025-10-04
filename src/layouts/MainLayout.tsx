import AppSidebar from "@/components/sidebar/AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth.provider";
import { getAllUsers, getCurrentUser } from "@/services/AuthService";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

export default function MainLayout() {
  const navigate = useNavigate();
  const { setUser, setAllUsers } = useAuth();

  useEffect(() => {
    fetchUser();
    fetchAllUsers();
  }, []);

  const fetchUser = async () => {
    const user = await getCurrentUser();
    if (user?.email) {
      setUser(user);
    } else {
      navigate("/login");
    }
  };
  const fetchAllUsers = async () => {
    const all = await getAllUsers();
    if (all.success) {
      setAllUsers(all?.data);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
        <div className="p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
