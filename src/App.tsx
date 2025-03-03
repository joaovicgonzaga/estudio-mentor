
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Schedule from "./pages/Schedule";
import Topics from "./pages/Topics";
import Metrics from "./pages/Metrics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/cronograma" element={<Schedule />} />
    <Route path="/temas" element={<Topics />} />
    <Route path="/metricas" element={<Metrics />} />
    <Route path="/configuracao" element={<Settings />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex h-svh w-full">
            <Navigation />
            <div className="flex w-full flex-col overflow-auto">
              <div className="sticky top-0 z-50 flex h-16 items-center border-b bg-white px-6">
                <SidebarTrigger>
                  <Menu className="h-6 w-6" />
                </SidebarTrigger>
                <span className="ml-4 text-lg font-semibold text-primary">
                  MEDTracker
                </span>
              </div>
              <main className="flex-1 overflow-auto p-6">
                <AppRoutes />
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
