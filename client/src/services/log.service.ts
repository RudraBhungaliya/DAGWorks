// import { api } from './api';

export interface LogEntry {
  id: string;
  timestamp: string;
  workflow: string;
  node: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  payload?: any;
}

export const logService = {
  async getLogs(filters?: { level?: string; search?: string }): Promise<LogEntry[]> {
    // const response = await api.get<LogEntry[]>('/logs', { params: filters });
    // return response.data;
    
    const mockLogs: LogEntry[] = [
      {
        id: "log-1",
        timestamp: "2026-03-29T22:15:01Z",
        workflow: "wf-142",
        node: "Trigger-Jira",
        level: "info",
        message: "Received webhook payload from Jira",
        payload: { issue: "PROJ-123", priority: "critical", assignee: null }
      },
      {
        id: "log-2",
        timestamp: "2026-03-29T22:15:02Z",
        workflow: "wf-142",
        node: "GitHub-Branch",
        level: "info",
        message: "Creating branch 'fix/PROJ-123'",
        payload: { repo: "DAGWorks", base: "main", head: "fix/PROJ-123" }
      },
      {
        id: "log-3",
        timestamp: "2026-03-29T22:15:04Z",
        workflow: "wf-142",
        node: "GitHub-Branch",
        level: "warn",
        message: "API rate limit approaching. 40 requests remaining.",
        payload: { limit: 5000, remaining: 40, reset: 1679000000 }
      },
      {
        id: "log-4",
        timestamp: "2026-03-29T22:15:05Z",
        workflow: "wf-142",
        node: "Slack-Notify",
        level: "error",
        message: "Failed to send message to #engineering channel",
        payload: { error: "channel_not_found", retryAttempt: 1 }
      }
    ];
    
    return Promise.resolve(mockLogs.filter(log => {
      if (filters?.level && filters.level !== 'all' && log.level !== filters.level) return false;
      return true;
    }));
  }
};
