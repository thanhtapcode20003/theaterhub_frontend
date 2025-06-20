import { Calendar, ChartSpline, Users } from "lucide-react";

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
];
