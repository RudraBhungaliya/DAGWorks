import { Handle, Position, type NodeProps } from "@xyflow/react";
import { CheckCircle2, Clock, PlayCircle, XCircle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export type NodeData = {
  label: string;
  service: string;
  status: "pending" | "running" | "success" | "failed";
  duration?: string;
};

const statusConfig = {
  pending: { icon: Clock, className: "text-muted-foreground bg-muted", border: "border-muted" },
  running: { icon: PlayCircle, className: "text-blue-500 bg-blue-500/10", border: "border-blue-500 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" },
  success: { icon: CheckCircle2, className: "text-green-500 bg-green-500/10", border: "border-green-500" },
  failed: { icon: XCircle, className: "text-destructive bg-destructive/10", border: "border-destructive" },
};

export function CustomNode({ data, selected }: NodeProps) {
  const d = data as NodeData;
  const config = statusConfig[d.status];
  const Icon = config.icon;

  return (
    <div className={cn(
      "px-4 py-3 shadow-lg rounded-xl border-2 bg-card min-w-[200px] transition-all",
      config.border,
      selected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
    )}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-muted-foreground" />
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-md", config.className)}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{d.service}</span>
        </div>
        {d.status === "running" && <Activity className="w-4 h-4 text-blue-500 animate-pulse" />}
      </div>
      
      <div className="font-semibold text-sm mb-1">{d.label}</div>
      <div className="text-xs text-muted-foreground flex justify-between items-center">
        <span className="capitalize">{d.status}</span>
        {d.duration && <span>{d.duration}</span>}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-muted-foreground" />
    </div>
  );
}
