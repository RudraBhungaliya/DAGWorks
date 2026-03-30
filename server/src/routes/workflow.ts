import { Router } from 'express';

const router = Router();

// In-memory store per session ID (in real app, use Redis/MongoDB)
const userWorkflows: Record<string, any[]> = {};

// Generate an ID helper
const genId = () => Math.random().toString(36).substring(2, 9);

router.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const sessionId = req.session.id;

  // Simulate parsing via NLP
  const plan = generateMockDAGFromPrompt(prompt);

  if (!userWorkflows[sessionId]) {
    userWorkflows[sessionId] = [];
  }
  userWorkflows[sessionId].push(plan);

  return res.json({ plan });
});

router.get('/', (req, res) => {
  const sessionId = req.session.id;
  res.json({ workflows: userWorkflows[sessionId] || [] });
});

function generateMockDAGFromPrompt(prompt: string) {
  const lowerPrompt = prompt.toLowerCase();
  
  const plan = {
    services: [] as string[],
    steps: [] as any[]
  };

  // 1. Determine Trigger
  if (lowerPrompt.includes('jira') || lowerPrompt.includes('bug') || lowerPrompt.includes('ticket')) {
    plan.services.push('Jira');
    plan.steps.push({ id: genId(), action: 'Trigger', desc: 'Listen for Jira issues', service: 'Jira' });
  } else if (lowerPrompt.includes('github') || lowerPrompt.includes('pr')) {
    plan.services.push('GitHub');
    plan.steps.push({ id: genId(), action: 'Trigger', desc: 'Listen for GitHub events', service: 'GitHub' });
  } else {
    // default
    plan.services.push('Webhook');
    plan.steps.push({ id: genId(), action: 'Trigger', desc: 'Receive Webhook Payload', service: 'Webhook' });
  }

  // 2. Determine Actions
  if (lowerPrompt.includes('github') && !plan.services.includes('GitHub')) {
    plan.services.push('GitHub');
    plan.steps.push({ id: genId(), action: 'Action', desc: 'Create/Update branch or PR', service: 'GitHub' });
  }

  if (lowerPrompt.includes('slack') || lowerPrompt.includes('notify') || lowerPrompt.includes('message')) {
    if (!plan.services.includes('Slack')) plan.services.push('Slack');
    plan.steps.push({ id: genId(), action: 'Action', desc: 'Send Slack notification', service: 'Slack' });
  }

  if (lowerPrompt.includes('sheet') || lowerPrompt.includes('log') || lowerPrompt.includes('tracker')) {
    if (!plan.services.includes('Google Sheets')) plan.services.push('Google Sheets');
    plan.steps.push({ id: genId(), action: 'Action', desc: 'Update Google Sheets tracker', service: 'Google Sheets' });
  }

  if (lowerPrompt.includes('email')) {
    if (!plan.services.includes('Email')) plan.services.push('Email');
    plan.steps.push({ id: genId(), action: 'Action', desc: 'Send notification email', service: 'Email' });
  }

  // Default fallback action
  if (plan.steps.length === 1) {
    plan.services.push('Logger');
    plan.steps.push({ id: genId(), action: 'Action', desc: 'Log generic execution payload', service: 'Logger' });
  }

  return plan;
}

export default router;
