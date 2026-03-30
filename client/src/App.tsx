import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { WorkflowsPage } from "./pages/workflows/WorkflowsPage";
import { IntegrationsPage } from "./pages/integrations/IntegrationsPage";
import { LogsPage } from "./pages/logs/LogsPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { SettingsPage } from "./pages/settings/SettingsPage";
import { useAuthStore } from "./store/authStore";
import { authService } from "./services/auth.service";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await authService.getProfile();
        setAuth(user);
      } catch (error) {
        // Mandatory login disabled for now - auto setup guest session
        console.warn("No valid session found. Auto-logging in for development.");
        setAuth({
          id: 'u-dev',
          email: 'guest@dagworks.local',
          name: 'Guest User',
          role: 'guest'
        });
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [setAuth]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 dark">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-2 animate-pulse">
            <span className="text-primary font-bold">...</span>
        </div>
        <p className="text-muted-foreground mt-4">Restoring session...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/workflows" element={<WorkflowsPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/logs" element={<LogsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
