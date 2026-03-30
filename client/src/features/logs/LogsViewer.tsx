import { useState } from "react";
import { Filter, Search, Terminal, AlertTriangle, Info, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_LOGS = [
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
  },
  {
    id: "log-5",
    timestamp: "2026-03-29T22:15:08Z",
    workflow: "wf-142",
    node: "Slack-Notify",
    level: "info",
    message: "Retry 2/3 successful",
    payload: { ts: "1678889999.123" }
  }
];

export function LogsViewer() {
  const [filterLevel, setFilterLevel] = useState("all");
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedLogs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredLogs = MOCK_LOGS.filter(log => filterLevel === "all" || log.level === filterLevel);

  return (
    <div className="flex flex-col h-full bg-background border rounded-lg overflow-hidden shadow-sm">
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <h2 className="font-semibold flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          Execution Logs
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center text-muted-foreground bg-muted rounded-md px-3 py-1.5 w-64 border">
            <Search className="w-4 h-4 mr-2" />
            <input
              type="text"
              placeholder="Filter by node or workflow..."
              className="bg-transparent border-none outline-none text-xs w-full text-foreground"
            />
          </div>
          <div className="flex bg-muted p-1 rounded-md border text-xs">
            <button
              className={`px-3 py-1 rounded-sm ${filterLevel === "all" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"}`}
              onClick={() => setFilterLevel("all")}
            >
              All
            </button>
            <button
              className={`px-3 py-1 rounded-sm ${filterLevel === "error" ? "bg-background shadow-sm font-medium text-destructive" : "text-muted-foreground"}`}
              onClick={() => setFilterLevel("error")}
            >
              Errors
            </button>
            <button
              className={`px-3 py-1 rounded-sm ${filterLevel === "warn" ? "bg-background shadow-sm font-medium text-yellow-500" : "text-muted-foreground"}`}
              onClick={() => setFilterLevel("warn")}
            >
              Warnings
            </button>
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#0d1117] text-[#c9d1d9] font-mono text-sm">
        <div className="grid grid-cols-[180px_100px_140px_auto] gap-4 p-3 border-b border-white/5 bg-[#161b22] text-xs font-semibold text-muted-foreground uppercase tracking-wider sticky top-0 z-10">
          <div>Timestamp</div>
          <div>Level</div>
          <div>Node</div>
          <div>Message</div>
        </div>

        <div className="divide-y divide-white/5">
          {filteredLogs.map(log => {
            const isError = log.level === "error";
            const isWarn = log.level === "warn";
            const isExpanded = expandedLogs[log.id];

            return (
              <div key={log.id} className={`group hover:bg-[#161b22] transition-colors ${isError ? "bg-red-950/20" : ""}`}>
                <div
                  className="grid grid-cols-[180px_100px_140px_auto] gap-4 p-3 items-start cursor-pointer"
                  onClick={() => toggleExpand(log.id)}
                >
                  <div className="text-gray-500 text-xs flex items-center gap-2">
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                  <div>
                    {isError && <span className="flex items-center gap-1.5 text-red-400"><AlertTriangle className="w-3.5 h-3.5" /> ERROR</span>}
                    {isWarn && <span className="flex items-center gap-1.5 text-yellow-400"><AlertTriangle className="w-3.5 h-3.5" /> WARN</span>}
                    {log.level === "info" && <span className="flex items-center gap-1.5 text-blue-400"><Info className="w-3.5 h-3.5" /> INFO</span>}
                  </div>
                  <div className="text-purple-400 text-xs truncate" title={log.node}>{log.node}</div>
                  <div className={`text-sm ${isError ? "text-red-300" : isWarn ? "text-yellow-300" : "text-gray-300"}`}>
                    {log.message}
                  </div>
                </div>

                {isExpanded && (
                  <div className="pl-[450px] pr-4 pb-4 bg-[#161b22]/50">
                    <div className="bg-[#010409] border border-white/10 rounded-md p-3 text-xs overflow-x-auto shadow-inner mt-2">
                      <pre className="text-green-400">{JSON.stringify(log.payload, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
