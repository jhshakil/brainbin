import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/auth.provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      {children}
      <Toaster position="top-right" />
    </AuthProvider>
  );
};

export default Providers;
