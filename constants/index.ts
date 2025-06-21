import { Calendar, ChartSpline, Users, Play } from "lucide-react";

export const sidebarLinks = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: ChartSpline,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Events",
    url: "/admin/events",
    icon: Calendar,
  },
  {
    title: "Loading Demo",
    url: "/admin/loading-demo",
    icon: Play,
  },
];
