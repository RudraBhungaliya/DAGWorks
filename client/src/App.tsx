import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import { WorkflowBuilder } from "./features/builder/WorkflowBuilder";
import { DAGVisualizer } from "./features/dag/DAGVisualizer";
import { IntegrationsPanel } from "./features/integrations/IntegrationsPanel";
import { LogsViewer } from "./features/logs/LogsViewer";
import { LoginPage } from "./features/auth/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<div className="p-0 h-full"><DAGVisualizer /></div>} />
          <Route path="/workflows" element={<div className="p-0 h-full"><WorkflowBuilder /></div>} />
          <Route path="/integrations" element={<div className="w-full h-full"><IntegrationsPanel /></div>} />
          <Route path="/logs" element={<div className="w-full h-full"><LogsViewer /></div>} />
          <Route path="/settings" element={<div>Settings Preview</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
