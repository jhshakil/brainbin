import MainLayout from "@/layouts/MainLayout";
import AllTasks from "@/pages/AllTasks";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import MyTasks from "@/pages/MyTasks";
import Signup from "@/pages/Signup";
import TeamMembers from "@/pages/TeamMembers";
import { createBrowserRouter } from "react-router";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/all-tasks",
        element: <AllTasks />,
      },
      {
        path: "/my-tasks",
        element: <MyTasks />,
      },
      {
        path: "/team-members",
        element: <TeamMembers />,
      },
    ],
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default routes;
