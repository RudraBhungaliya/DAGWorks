import { Request, Response } from 'express';
import { Workflow } from '../../models/Workflow';
import { LogEntry } from '../../models/LogEntry';

const genId = () => Math.random().toString(36).substring(2, 9);

function generateMockDAGFromPrompt(prompt: string) {
  const lowerPrompt = prompt.toLowerCase();
  
  const nodes: any[] = [];
  const edges: any[] = [];
  let yOffset = 0;

  const addNode = (type: string, data: any) => {
    const id = genId();
    nodes.push({ id, type, position: { x: 250, y: yOffset }, data });
    yOffset += 100;
    return id;
  };

  const addEdge = (source: string, target: string) => {
    edges.push({ id: `e-${source}-${target}`, source, target });
  };

  let triggerId = '';
  // 1. Determine Trigger
  if (lowerPrompt.includes('jira') || lowerPrompt.includes('bug') || lowerPrompt.includes('ticket')) {
    triggerId = addNode('trigger', { label: 'Jira Trigger', service: 'Jira' });
  } else if (lowerPrompt.includes('github') || lowerPrompt.includes('pr')) {
    triggerId = addNode('trigger', { label: 'GitHub Event', service: 'GitHub' });
  } else {
    triggerId = addNode('trigger', { label: 'Webhook', service: 'Webhook' });
  }

  // 2. Determine Actions
  let lastNodeId = triggerId;

  if (lowerPrompt.includes('github') && !lowerPrompt.includes('pr')) {
    const actionId = addNode('action', { label: 'GitHub Action', service: 'GitHub' });
    addEdge(lastNodeId, actionId);
    lastNodeId = actionId;
  }

  if (lowerPrompt.includes('slack') || lowerPrompt.includes('notify') || lowerPrompt.includes('message')) {
    const actionId = addNode('action', { label: 'Slack Notify', service: 'Slack' });
    addEdge(lastNodeId, actionId);
    lastNodeId = actionId;
  }

  if (lowerPrompt.includes('sheet') || lowerPrompt.includes('log') || lowerPrompt.includes('tracker')) {
    const actionId = addNode('action', { label: 'Google Sheets', service: 'Google Sheets' });
    addEdge(lastNodeId, actionId);
    lastNodeId = actionId;
  }

  // Default fallback
  if (nodes.length === 1) {
    const actionId = addNode('action', { label: 'Logger', service: 'Logger' });
    addEdge(lastNodeId, actionId);
  }

  return { nodes, edges };
}

export const generateWorkflow = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const plan = generateMockDAGFromPrompt(prompt);
    
    // Auto-save a draft
    const newDoc = await Workflow.create({
      name: `Generated Workflow: ${prompt.substring(0, 20)}...`,
      description: prompt,
      status: 'draft',
      nodes: plan.nodes,
      edges: plan.edges,
      userId: (req.session as any).userId || null
    });

    res.json({ plan: { ...plan, id: newDoc._id } });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err });
  }
};

export const getWorkflows = async (req: Request, res: Response) => {
  try {
    const filter: any = {};
    if ((req.session as any).userId) {
       filter.userId = (req.session as any).userId;
    }
    const workflows = await Workflow.find(filter).sort({ updatedAt: -1 });
    res.json(workflows.map(w => ({
      id: w._id,
      name: w.name,
      description: w.description,
      status: w.status,
      lastRun: w.lastRun
    })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getWorkflow = async (req: Request, res: Response) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) return res.status(404).json({ error: 'Not found' });
    
    res.json({
      id: workflow._id,
      name: workflow.name,
      description: workflow.description,
      status: workflow.status,
      nodes: workflow.nodes,
      edges: workflow.edges
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const saveWorkflow = async (req: Request, res: Response) => {
  try {
    const workflow = await Workflow.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!workflow) return res.status(404).json({ error: 'Not found' });
    res.json(workflow);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const executeWorkflow = async (req: Request, res: Response) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) return res.status(404).json({ error: 'Not found' });

    workflow.lastRun = new Date();
    await workflow.save();

    const executionId = `exec-${Date.now()}`;

    // Create execution mock logs based on the first node
    const firstNode = workflow.nodes.find(n => n.type === 'trigger') || workflow.nodes[0];
    const triggerLabel = firstNode ? firstNode.data.label : 'API Trigger';

    await LogEntry.create([
      { workflowId: workflow._id, node: triggerLabel, level: 'info', message: 'Workflow execution started', payload: { executionId } },
      { workflowId: workflow._id, node: triggerLabel, level: 'info', message: 'Trigger conditions met, executing actions...' },
      { workflowId: workflow._id, node: triggerLabel, level: 'debug', message: 'Payload received successfully' }
    ]);

    res.json({ executionId });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
