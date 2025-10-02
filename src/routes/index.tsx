import MainLayout from "@/layouts/MainLayout";
import AllTasks from "@/pages/AllTasks";
import Dashboard from "@/pages/Dashboard";
import MyTasks from "@/pages/MyTasks";
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
]);

export default routes;
