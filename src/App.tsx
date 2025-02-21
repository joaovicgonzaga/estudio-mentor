
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  BookOpen,
  BarChart,
  Settings as SettingsIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

import Index from "./pages/Index";
import Schedule from "./pages/Schedule";
import Topics from "./pages/Topics";
import Metrics from "./pages/Metrics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
    <nav className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <span className="text-lg font-semibold text-primary">
            ResidênciaMed
          </span>
          <div className="flex items-center space-x-4">
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
        </div>
      </div>
    </nav>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cronograma" element={<Schedule />} />
          <Route path="/temas" element={<Topics />} />
          <Route path="/metricas" element={<Metrics />} />
          <Route path="/configuracao" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
