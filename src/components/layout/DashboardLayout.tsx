
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart3,
  Building2,
  Clock,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, label, href, active, onClick }: SidebarItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(href);
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors w-full",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
    </button>
  );
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout, hasRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Get current path for highlighting active menu item
  const pathname = window.location.pathname;
  
  const handleLogout = () => {
    logout();
    toast({ 
      title: "Logged out", 
      description: "You have been successfully logged out." 
    });
    navigate("/");
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  
  const menuItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      href: "/dashboard",
      roles: ["admin", "manager", "guard"],
    },
    {
      icon: <Building2 className="h-5 w-5" />,
      label: "Companies",
      href: "/companies",
      roles: ["admin"],
    },
    {
      icon: <Shield className="h-5 w-5" />,
      label: "Sites",
      href: "/sites",
      roles: ["admin", "manager"],
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Users",
      href: "/users",
      roles: ["admin", "manager"],
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: "Check-ins",
      href: "/checkins",
      roles: ["admin", "manager", "guard"],
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Reports",
      href: "/reports",
      roles: ["admin", "manager"],
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: "Analytics",
      href: "/analytics",
      roles: ["admin"],
    },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    // Show item if user has any of the required roles
    return item.roles.some(role => hasRole(role));
  });

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar w-64 border-r border-sidebar-border flex-shrink-0 flex-col z-40",
          isMobile
            ? "fixed inset-y-0 left-0 transform transition-transform duration-200 ease-in-out"
            : "flex"
        )}
        style={{
          transform: isMobile
            ? sidebarOpen
              ? "translateX(0)"
              : "translateX(-100%)"
            : "none",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo and close button for mobile */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-secureGuard-blue" />
              <span className="ml-2 font-bold text-lg text-sidebar-foreground">
                SecureGuard
              </span>
            </div>
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={closeSidebar}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          {/* User info */}
          <div className="px-4 py-4 border-b border-sidebar-border">
            <div className="text-sidebar-foreground font-medium">
              {user?.name}
            </div>
            <div className="text-sidebar-foreground/60 text-sm capitalize">
              {user?.role}
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="px-2 py-4 space-y-1 flex-1 overflow-y-auto">
            {filteredMenuItems.map((item, index) => (
              <SidebarItem
                key={index}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={pathname === item.href}
                onClick={isMobile ? closeSidebar : undefined}
              />
            ))}
          </nav>
          
          {/* Logout */}
          <div className="px-2 py-4 border-t border-sidebar-border">
            <SidebarItem
              icon={<LogOut className="h-5 w-5" />}
              label="Logout"
              href="#"
              onClick={handleLogout}
            />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-dashboard-pattern">
        <div className="container mx-auto py-6 px-4 md:px-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
