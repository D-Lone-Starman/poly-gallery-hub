import Index from "@/pages/Index";
import { Shop } from "@/pages/Shop";
import { Auth } from "@/pages/Auth";
import NotFound from "@/pages/NotFound";

export const navItems = [
  {
    title: "Home",
    to: "/",
    page: <Index />,
  },
  {
    title: "Shop",
    to: "/shop",
    page: <Shop />,
  },
  {
    title: "Auth",
    to: "/auth",
    page: <Auth />,
  },
  {
    title: "404",
    to: "*",
    page: <NotFound />,
  },
];