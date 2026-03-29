import { useState } from "react";
import { Link as LinkIcon, Unlink, ExternalLink, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const INTEGRATIONS = [
  {
    id: "github",
    name: "GitHub",
    description: "Connect to manage repositories, branches, and issues.",
    icon: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    status: "connected",
    scopes: ["repo", "read:org", "workflow"],
    lastActivity: "2 mins ago"
  },
  {
    id: "slack",
    name: "Slack",
    description: "Send notifications and interact via chat.",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png",
    status: "connected",
    scopes: ["chat:write", "channels:read"],
    lastActivity: "1 hr ago"
  },
  {
    id: "jira",
    name: "Jira Software",
    description: "Track bugs, tasks, and agile boards.",
    icon: "https://cdn.iconscout.com/icon/free/png-256/free-jira-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-company-brand-vol-3-pack-logos-icons-2944949.png",
    status: "disconnected",
    scopes: ["read:jira-work", "write:jira-work"],
    lastActivity: "Never"
  },
  {
    id: "sheets",
    name: "Google Sheets",
    description: "Read and write data to spreadsheets.",
    icon: "https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg",
    status: "connected",
    scopes: ["spreadsheets.readonly", "spreadsheets"],
    lastActivity: "5 hours ago"
  }
];

export function IntegrationsPanel() {
  const [integrations, setIntegrations] = useState(INTEGRATIONS);

  const toggleConnection = (id: string) => {
    setIntegrations(prev => prev.map(int => {
      if (int.id === id) {
        return { ...int, status: int.status === "connected" ? "disconnected" : "connected" };
      }
      return int;
    }));
  };

  return (
    <div className="space-y-6 flex-1 h-full overflow-y-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">MCP Integrations</h1>
        <p className="text-muted-foreground text-sm">
          Manage connections and permission scopes for your agent tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {integrations.map(integration => (
          <Card key={integration.id} className={`flex flex-col transition-all border-2 ${integration.status === 'connected' ? 'border-primary/20 bg-primary/5' : 'border-border opacity-75'}`}>
            <CardHeader className="flex flex-row items-start justify-between pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-background border p-2 flex items-center justify-center shrink-0">
                  <img src={integration.icon} alt={integration.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{integration.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {integration.status === "connected" ? (
                      <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 text-[10px] px-2 py-0">Connected</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] px-2 py-0">Disconnected</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <p className="text-sm text-muted-foreground h-10">
                {integration.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground gap-2">
                  <ShieldAlert className="w-3.5 h-3.5" /> Permissions Scope
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {integration.scopes.map(scope => (
                    <span key={scope} className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-sm font-mono border">
                      {scope}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground pt-4 border-t border-border/50">
                Last activity: <span className="font-medium text-foreground">{integration.lastActivity}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t bg-muted/20 flex gap-3">
              <Button 
                variant={integration.status === "connected" ? "outline" : "default"} 
                className={integration.status === "connected" ? "flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20" : "flex-1"}
                onClick={() => toggleConnection(integration.id)}
              >
                {integration.status === "connected" ? (
                  <><Unlink className="w-4 h-4 mr-2" /> Disconnect</>
                ) : (
                  <><LinkIcon className="w-4 h-4 mr-2" /> Connect</>
                )}
              </Button>
              <Button variant="outline" size="icon">
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
