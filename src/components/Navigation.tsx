
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

const NAVIGATION_LINKS = [
  { to: "/", icon: Home, label: "Início" },
  { to: "/cronograma", icon: Calendar, label: "Cronograma" },
  { to: "/temas", icon: BookOpen, label: "Temas" },
  {
    to: "/metricas",
    icon: BarChart,
    label: "Controle de Revisão e Métricas",
  },
  { to: "/configuracao", icon: SettingsIcon, label: "Configuração" },
] as const;

const NavigationLink = ({ to, icon: Icon, label }: typeof NAVIGATION_LINKS[number]) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      key={to}
      to={to}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-gray-600 hover:bg-gray-50"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
};

const HeaderContent = () => (
  <div className="flex h-16 items-center border-b px-6">
    <SidebarTrigger>
      <Menu className="h-6 w-6" />
    </SidebarTrigger>
    <span className="ml-4 text-lg font-semibold text-primary">
      ResidênciaMed
    </span>
  </div>
);

const Navigation = () => {
  return (
    <Sidebar>
      <HeaderContent />
      <SidebarContent>
        <nav className="flex flex-col gap-1 p-4">
          {NAVIGATION_LINKS.map((link) => (
            <NavigationLink key={link.to} {...link} />
          ))}
        </nav>
      </SidebarContent>
    </Sidebar>
  );
};

export default Navigation;
