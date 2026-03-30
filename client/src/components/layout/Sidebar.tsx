import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  GitGraph,
  Blocks,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { authService } from "../../services/auth.service";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Workflows", href: "/workflows", icon: GitGraph },
  { name: "Integrations", href: "/integrations", icon: Blocks },
  { name: "Logs", href: "/logs", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await authService.logout();
    logout();
    window.location.href = "/login"; // Force full reload to login screen
  };

  return (
    <aside className="w-64 border-r bg-card flex flex-col h-full shrink-0">
      <div className="h-16 flex items-center px-6 border-b shrink-0">
        <GitGraph className="w-6 h-6 text-primary mr-2" />
        <span className="font-semibold text-lg tracking-tight">DAGWorks</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5 mr-3", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-accent flex shrink-0 items-center justify-center text-accent-foreground font-semibold text-sm">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium truncate">{user?.name || "Guest"}</span>
            <span className="text-xs text-muted-foreground truncate">{user?.email || "guest@dagworks.local"}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 text-muted-foreground hover:text-destructive shrink-0 transition-colors" title="Log out">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
