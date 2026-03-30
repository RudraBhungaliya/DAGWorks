import { Request, Response } from 'express';
import { Integration } from '../../models/Integration';

// Initial seed
const SECURE_INTEGRATIONS = [
  { id: '1', name: 'Jira Software', description: 'Issue tracking & agile project management', type: 'jira' },
  { id: '2', name: 'GitHub', description: 'Code hosting and version control', type: 'github' },
  { id: '3', name: 'Slack', description: 'Team messaging and notifications', type: 'slack' },
  { id: '4', name: 'PagerDuty', description: 'Incident response and alerting', type: 'pagerduty' }
];

export const getIntegrations = async (req: Request, res: Response) => {
  try {
    const filter: any = {};
    if ((req.session as any).userId) {
       filter.userId = (req.session as any).userId;
    }
    
    // In a real app we'd join seed data and configured ones
    let dbIntegrations = await Integration.find(filter);
    
    if (dbIntegrations.length === 0) {
        // Seed default disconnected stats
        const seeded = SECURE_INTEGRATIONS.map(i => ({
            name: i.name,
            description: i.description,
            type: i.type,
            status: 'disconnected',
            userId: (req.session as any).userId || undefined
        }));
        dbIntegrations = await Integration.insertMany(seeded);
    }
    
    res.json(dbIntegrations.map(doc => ({
      id: doc._id,
      name: doc.name,
      description: doc.description,
      type: doc.type,
      status: doc.status,
      lastSynced: doc.lastSynced
    })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const connectIntegration = async (req: Request, res: Response) => {
  try {
    const integration = await Integration.findByIdAndUpdate(
      req.params.id, 
      { status: 'connected', lastSynced: new Date() },
      { new: true }
    );
    if (!integration) return res.status(404).json({ error: 'Not found' });
    
    res.json({
        id: integration._id,
        name: integration.name,
        description: integration.description,
        type: integration.type,
        status: integration.status,
        lastSynced: integration.lastSynced
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const disconnectIntegration = async (req: Request, res: Response) => {
  try {
    const integration = await Integration.findByIdAndUpdate(
      req.params.id, 
      { status: 'disconnected', lastSynced: null },
      { new: true }
    );
    if (!integration) return res.status(404).json({ error: 'Not found' });
    
    res.json({ success: true, status: 'disconnected' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
