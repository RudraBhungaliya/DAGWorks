import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { WorkflowsPage } from "./pages/workflows/WorkflowsPage";
import { IntegrationsPage } from "./pages/integrations/IntegrationsPage";
import { LogsPage } from "./pages/logs/LogsPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { SettingsPage } from "./pages/settings/SettingsPage";
// import { useAuthStore } from "./store/authStore";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Temporarily bypass auth check for UI testing
  // const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }
  
  return <>{children}</>;
};

function App() {
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
