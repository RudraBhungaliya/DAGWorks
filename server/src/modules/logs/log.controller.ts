import { Request, Response } from 'express';
import { LogEntry } from '../../models/LogEntry';

export const getLogs = async (req: Request, res: Response) => {
  try {
    const { level } = req.query;
    const filter: any = {};
    
    if (level && level !== 'all') {
      filter.level = level;
    }
    
    const logs = await LogEntry.find(filter).sort({ createdAt: -1 }).limit(100);
    
    res.json(logs.map(log => ({
        id: log._id,
        timestamp: log.createdAt,
        workflow: log.workflowId,
        node: log.node,
        level: log.level,
        message: log.message,
        payload: log.payload
    })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
