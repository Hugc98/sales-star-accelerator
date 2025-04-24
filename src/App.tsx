
import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loader } from "lucide-react";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import RecoverPasswordPage from "./pages/auth/RecoverPasswordPage";
import AuthDiagnosticPage from "./pages/auth/AuthDiagnosticPage";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/auth/AuthGuard";
import { initSecurity } from "@/lib/auth";

// Lazy loaded components
const Dashboard = lazy(() => import("./pages/Index"));
const LeadsPage = lazy(() => import("./pages/LeadsPage"));
const RankingPage = lazy(() => import("./pages/RankingPage"));
const PipelinePage = lazy(() => import("./pages/PipelinePage"));
const ConversationsPage = lazy(() => import("./pages/ConversationsPage"));
const HelpPage = lazy(() => import("./pages/HelpPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const MarketingAutomationPage = lazy(() => import("./pages/MarketingAutomationPage"));

// Página de acesso negado
const AccessDenied = lazy(() => import("./pages/auth/AccessDenied"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <Loader className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2 text-lg font-medium">Carregando...</span>
  </div>
);

// Configure Query Client with caching strategies
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  // Inicializa o sistema de segurança na montagem do aplicativo
  React.useEffect(() => {
    initSecurity();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth routes - not lazy loaded for faster initial access */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/recuperar-senha" element={<RecoverPasswordPage />} />
            <Route path="/auth-diagnostico" element={<AuthDiagnosticPage />} />
            <Route path="/acesso-negado" element={
              <Suspense fallback={<LoadingFallback />}>
                <AccessDenied />
              </Suspense>
            } />
            
            {/* App routes - lazy loaded and protected */}
            <Route path="/" element={
              <AuthGuard>
                <Suspense fallback={<LoadingFallback />}>
                  <Dashboard />
                </Suspense>
              </AuthGuard>
            } />
            <Route path="/leads/*" element={
              <AuthGuard requiredPermissions={["leads.view"]}>
                <Suspense fallback={<LoadingFallback />}>
                  <LeadsPage />
                </Suspense>
              </AuthGuard>
            } />
            <Route path="/ranking" element={
              <AuthGuard>
                <Suspense fallback={<LoadingFallback />}>
                  <RankingPage />
                </Suspense>
              </AuthGuard>
            } />
            <Route path="/pipeline" element={
              <AuthGuard>
                <Suspense fallback={<LoadingFallback />}>
                  <PipelinePage />
                </Suspense>
              </AuthGuard>
            } />
            <Route path="/conversas" element={
              <AuthGuard>
                <Suspense fallback={<LoadingFallback />}>
                  <ConversationsPage />
                </Suspense>
              </AuthGuard>
            } />
            <Route path="/automacao" element={
              <AuthGuard>
                <Suspense fallback={<LoadingFallback />}>
                  <MarketingAutomationPage />
                </Suspense>
              </AuthGuard>
            } />
            <Route path="/ajuda" element={
              <AuthGuard>
                <Suspense fallback={<LoadingFallback />}>
                  <HelpPage />
                </Suspense>
              </AuthGuard>
            } />
            <Route path="/configuracoes" element={
              <AuthGuard>
                <Suspense fallback={<LoadingFallback />}>
                  <SettingsPage />
                </Suspense>
              </AuthGuard>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
