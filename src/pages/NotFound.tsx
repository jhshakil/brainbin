import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
      <h1 className="text-9xl font-extrabold tracking-widest text-red-500">
        404
      </h1>
      <p className="text-2xl md:text-3xl mt-4">Oops! Page not found.</p>
      <p className="text-md md:text-lg mt-2 text-gray-500">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className={cn(buttonVariants({ variant: "default" }), "mt-6")}
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
