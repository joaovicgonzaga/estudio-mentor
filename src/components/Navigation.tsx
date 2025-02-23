
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  BookOpen,
  BarChart,
  Settings as SettingsIcon,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();

  const links = [
    { to: "/", icon: Home, label: "Início" },
    { to: "/cronograma", icon: Calendar, label: "Cronograma" },
    { to: "/temas", icon: BookOpen, label: "Temas" },
    {
      to: "/metricas",
      icon: BarChart,
      label: "Controle de Revisão e Métricas",
    },
    { to: "/configuracao", icon: SettingsIcon, label: "Configuração" },
  ];

  return (
    <div className="flex h-screen w-full">
      <Sidebar>
        <div className="flex h-16 items-center border-b px-6">
          <SidebarTrigger>
            <Menu className="h-6 w-6" />
          </SidebarTrigger>
          <span className="ml-4 text-lg font-semibold text-primary">
            ResidênciaMed
          </span>
        </div>
        <SidebarContent>
          <div className="flex flex-col gap-1 p-4">
            {links.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  location.pathname === to
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
        </SidebarContent>
      </Sidebar>
      <div className="flex-1">
        <div className="sticky top-0 z-50 flex h-16 items-center border-b bg-white px-6">
          <span className="text-lg font-semibold text-primary">
            ResidênciaMed
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
