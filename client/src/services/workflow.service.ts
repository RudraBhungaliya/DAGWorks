// import { api } from './api';

export interface WorkflowSummary {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  lastRun?: string;
}

export interface NodeData {
  id: string;
  position: { x: number; y: number };
  data: any;
  type: string;
}

export interface EdgeData {
  id: string;
  source: string;
  target: string;
}

export interface WorkflowDetails extends WorkflowSummary {
  nodes: NodeData[];
  edges: EdgeData[];
}

export const workflowService = {
  async getWorkflows(): Promise<WorkflowSummary[]> {
    // const response = await api.get<WorkflowSummary[]>('/workflows');
    // return response.data;
    
    return Promise.resolve([
      { id: 'wf-1', name: 'GitHub to Slack Notifier', description: 'Notifies eng channel on PR creation', status: 'active', lastRun: new Date().toISOString() },
      { id: 'wf-2', name: 'Jira Issue Sync', description: 'Sync critical issues to external vendor', status: 'draft' }
    ]);
  },

  async getWorkflow(id: string): Promise<WorkflowDetails> {
    // const response = await api.get<WorkflowDetails>(`/workflows/${id}`);
    // return response.data;

    return Promise.resolve({
      id,
      name: `Workflow ${id}`,
      description: 'Mock loaded workflow',
      status: 'active',
      nodes: [],
      edges: [],
    });
  },

  async saveWorkflow(_id: string, payload: Partial<WorkflowDetails>): Promise<WorkflowDetails> {
    // const response = await api.put<WorkflowDetails>(`/workflows/${id}`, payload);
    // return response.data;
    
    return Promise.resolve(payload as WorkflowDetails);
  },

  async executeWorkflow(_id: string): Promise<{ executionId: string }> {
    // const response = await api.post<{ executionId: string }>(`/workflows/${id}/execute`);
    // return response.data;
    
    return Promise.resolve({ executionId: `exec-${Date.now()}` });
  }
};
