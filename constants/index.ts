import { Calendar, ChartSpline, Users } from "lucide-react";

// Dynamic sidebar links based on role - using [role] dynamic routing
export const getSidebarLinks = (userRole?: string) => {
  switch (userRole) {
    case "admin":
      return [
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
    case "staff":
      return [
        {
          title: "Dashboard",
          url: "/staff",
          icon: ChartSpline,
        },
        {
          title: "My Events",
          url: "/staff/events",
          icon: Calendar,
        },
      ];
    default:
      return [];
  }
};
