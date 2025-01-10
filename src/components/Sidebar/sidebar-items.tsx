import { LayoutDashboard, SquareLibrary, Bell } from "lucide-react";

const iconSize = 20;

export const SidebarItems = [
  {
    route: "Dashboard",
    icon: <LayoutDashboard size={iconSize} />,
  },
  {
    route: "Admin",
    icon: <SquareLibrary size={iconSize} />,
  },

  {
    route: "Notifications",
    icon: <Bell size={iconSize} />,
    notifs: 3,
  },
];
