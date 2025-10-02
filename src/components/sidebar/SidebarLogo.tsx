import { Brain } from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import { cn } from "@/lib/utils";

const SidebarLogo = () => {
  const { isMobile, state } = useSidebar();

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-2 text-2xl font-bold",
        state === "collapsed" || isMobile ? "py-2" : "py-4"
      )}
    >
      <span>
        <Brain />
      </span>
      <span className={cn((state === "collapsed" || isMobile) && "hidden")}>
        BrainBin
      </span>
    </div>
  );
};

export default SidebarLogo;
