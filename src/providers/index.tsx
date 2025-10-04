import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/auth.provider";
import { TaskProvider } from "@/context/task.provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <TaskProvider>
      <AuthProvider>
        {children}
        <Toaster position="top-right" />
      </AuthProvider>
    </TaskProvider>
  );
};

export default Providers;
