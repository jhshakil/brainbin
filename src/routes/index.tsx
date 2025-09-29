import MainLayout from "@/layouts/MainLayout";
import Dashboard from "@/pages/Dashboard";
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
    ],
  },
]);

export default routes;
