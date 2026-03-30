import { create } from 'zustand';

export interface WorkflowStep {
  id: string;
  action: string;
  desc: string;
  service: string;
}

export interface WorkflowPlan {
  services: string[];
  steps: WorkflowStep[];
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  workflow: string;
  node: string;
  level: "info" | "warn" | "error";
  message: string;
  payload?: any;
}

interface WorkflowState {
  activePlan: WorkflowPlan | null;
  logs: ExecutionLog[];
  executionState: 'idle' | 'running' | 'completed';
  setActivePlan: (plan: WorkflowPlan | null) => void;
  setExecutionState: (state: 'idle' | 'running' | 'completed') => void;
  addLog: (log: Omit<ExecutionLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  activePlan: null,
  logs: [],
  executionState: 'idle',
  setActivePlan: (plan) => set({ activePlan: plan }),
  setExecutionState: (state) => set({ executionState: state }),
  addLog: (log) => set((state) => ({
    logs: [...state.logs, {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    }]
  })),
  clearLogs: () => set({ logs: [] }),
}));
