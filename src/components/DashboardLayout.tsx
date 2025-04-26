
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  SendHorizonal,
  UserRound,
  LifeBuoy,
  BellRing,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Footer from "@/components/Footer";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const initials = user?.user_metadata?.first_name && user?.user_metadata?.last_name
    ? `${user.user_metadata.first_name[0]}${user.user_metadata.last_name[0]}`
    : "NU";

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Accounts",
      path: "/accounts",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: <ArrowLeftRight className="w-5 h-5" />,
    },
    {
      name: "Payments",
      path: "/payments",
      icon: <SendHorizonal className="w-5 h-5" />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <UserRound className="w-5 h-5" />,
    },
    {
      name: "Support",
      path: "/support",
      icon: <LifeBuoy className="w-5 h-5" />,
    },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-primary text-white shadow-md sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white mr-2"
              onClick={toggleSidebar}
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <Link to="/" className="text-xl font-bold">
              North Trust Bank
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white relative">
                  <BellRing className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>

            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarFallback className="bg-accent text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <div className="text-sm font-medium">
                  {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for navigation */}
        <aside
          className={`bg-white shadow-lg fixed md:static inset-y-0 left-0 z-20 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 w-64 md:w-64 flex-shrink-0 overflow-y-auto`}
        >
          <div className="py-6 flex flex-col h-full">
            <div className="px-4 py-2 md:hidden">
              <Button variant="ghost" className="w-full justify-start" onClick={toggleSidebar}>
                <X className="w-5 h-5 mr-2" /> Close Menu
              </Button>
            </div>
            <nav className="flex-1">
              <div className="px-4 py-2">
                <p className="text-xs uppercase font-semibold text-gray-500 tracking-wider">Main Menu</p>
              </div>
              <ul className="space-y-1 px-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                        location.pathname === item.path
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto px-4 pb-4">
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                onClick={signOut}
              >
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="container mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <Footer />
    </div>
  );
};

export default DashboardLayout;
