import LoginForm from "@/components/form/LoginForm";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

const Login = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Login account</CardTitle>
            <CardDescription>
              Enter your information below to Login your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          <CardFooter className="flex flex-col justify-center">
            <p className="text-sm">
              If you do not have an account
              <Link
                to={"/signup"}
                className={cn(buttonVariants({ variant: "link" }), "px-1.5")}
              >
                click here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
