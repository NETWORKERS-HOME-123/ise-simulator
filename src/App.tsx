import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CiscoHeader from "@/components/CiscoHeader";
import Index from "./pages/Index";
import ContextVisibility from "./pages/ContextVisibility";
import Operations from "./pages/Operations";
import Policy from "./pages/Policy";
import WorkCenters from "./pages/WorkCenters";
import Administration from "./pages/Administration";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-background">
          <CiscoHeader />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/context-visibility" element={<ContextVisibility />} />
              <Route path="/operations" element={<Operations />} />
              <Route path="/policy" element={<Policy />} />
              <Route path="/work-centers" element={<WorkCenters />} />
              <Route path="/administration" element={<Administration />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
