import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ConnectionLineType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomNode } from './CustomNode';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ApprovalModal } from '../dashboard/ApprovalModal';

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'custom',
    position: { x: 250, y: 50 },
    data: { label: 'Listen for Jira bug', service: 'Jira', status: 'success', duration: '12ms' },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 100, y: 200 },
    data: { label: 'Create GitHub Branch', service: 'GitHub', status: 'success', duration: '450ms' },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 400, y: 200 },
    data: { label: 'Notify #engineering', service: 'Slack', status: 'running', duration: '...' },
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 250, y: 350 },
    data: { label: 'Log Incident', service: 'Google Sheets', status: 'pending' },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#22c55e', strokeWidth: 2 } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-4', source: '3', target: '4' },
];

export function DAGVisualizer() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes as any);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [showApproval, setShowApproval] = useState(false);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)),
    [setEdges],
  );

  const onNodeClick = (_: any, node: any) => {
    setSelectedNode(node);
  };

  return (
    <div className="w-full h-[calc(100vh-8rem)] flex gap-6">
      <Card className="flex-1 h-full overflow-hidden border-border bg-background shadow-sm">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-muted/10"
        >
          <Background color="#555" gap={16} />
          <Controls className="fill-foreground bg-card border" />
        </ReactFlow>
        <div className="absolute bottom-4 left-4 z-10">
          <Button onClick={() => setShowApproval(true)} variant="secondary" className="shadow-md border border-border">
            Simulate Approval
          </Button>
        </div>
      </Card>
      
      <ApprovalModal 
        isOpen={showApproval} 
        onApprove={() => setShowApproval(false)} 
        onReject={() => setShowApproval(false)} 
      />

      {selectedNode && (
        <Card className="w-80 h-full flex flex-col shrink-0 shadow-sm border-border">
          <div className="p-4 border-b font-semibold bg-muted/20 flex items-center justify-between">
            <span>Node Details</span>
            <button className="text-muted-foreground hover:text-foreground" onClick={() => setSelectedNode(null)}>
              ✕
            </button>
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-4 text-sm">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Service</p>
              <p className="font-medium bg-muted w-fit px-2 py-0.5 rounded-sm">{selectedNode.data.service}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Action</p>
              <p className="text-sm border-l-2 border-primary pl-2">{selectedNode.data.label}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                selectedNode.data.status === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                selectedNode.data.status === 'running' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                selectedNode.data.status === 'failed' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                'bg-muted text-muted-foreground border-border'
              }`}>
                {selectedNode.data.status}
              </span>
            </div>
            {selectedNode.data.duration && (
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Duration</p>
                <p className="font-mono text-muted-foreground">{selectedNode.data.duration}</p>
              </div>
            )}
            
            <div className="pt-4 mt-4 border-t border-dashed border-border/50">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-2">Payload Preview</p>
              <pre className="text-[10px] p-3 rounded-md bg-zinc-950 text-zinc-300 overflow-x-auto border border-zinc-800 font-mono shadow-inner">
                {JSON.stringify({
                  id: selectedNode.id,
                  type: selectedNode.type,
                  params: {
                    repo: "DAGWorks",
                    branch: "fix-critical-bug"
                  }
                }, null, 2)}
              </pre>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
