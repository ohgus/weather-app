import { createBrowserRouter } from "react-router";
import { RootLayout } from "../ui/RootLayout";
import { HomePage } from "@/pages/home";
import { DetailPage } from "@/pages/detail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "detail/:locationId", Component: DetailPage },
    ],
  },
]);
