// import { api } from './api';

export interface Integration {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSynced?: string;
}

export const integrationService = {
  async getIntegrations(): Promise<Integration[]> {
    // const response = await api.get<Integration[]>('/integrations');
    // return response.data;
    
    return Promise.resolve([
      { id: '1', name: 'Jira Software', description: 'Issue tracking & agile project management', type: 'jira', status: 'connected', lastSynced: '10 mins ago' },
      { id: '2', name: 'GitHub', description: 'Code hosting and version control', type: 'github', status: 'connected', lastSynced: '2 mins ago' },
      { id: '3', name: 'Slack', description: 'Team messaging and notifications', type: 'slack', status: 'disconnected' },
      { id: '4', name: 'PagerDuty', description: 'Incident response and alerting', type: 'pagerduty', status: 'disconnected' }
    ]);
  },

  async connectIntegration(id: string, _config: any): Promise<Integration> {
    // const response = await api.post<Integration>(`/integrations/${id}/connect`, config);
    // return response.data;
    
    return Promise.resolve({
      id,
      name: 'Integration Name',
      description: 'Connected Integration',
      type: 'unknown',
      status: 'connected',
      lastSynced: 'just now',
    });
  },

  async disconnectIntegration(_id: string): Promise<void> {
    // await api.post(`/integrations/${id}/disconnect`);
    return Promise.resolve();
  }
};
