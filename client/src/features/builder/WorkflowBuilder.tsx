import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Check, RefreshCw, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useWorkflowStore } from "../../store/workflowStore";
import { workflowService } from "../../services/workflow.service";

export function WorkflowBuilder() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([
    { role: "ai", content: "Hi! Describe the workflow you want to build. For example: 'When a critical bug is filed in Jira, create a GitHub branch, notify Slack, and update Google Sheets.'" }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any | null>(null);
  const setActivePlan = useWorkflowStore((state) => state.setActivePlan);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    
    const userPrompt = prompt.trim();
    setMessages((prev) => [...prev, { role: "user", content: userPrompt }]);
    setPrompt("");
    setIsGenerating(true);

    try {
      const plan = await workflowService.generateWorkflowPlan(userPrompt);
      setMessages((prev) => [...prev, { 
        role: "ai", 
        content: "I've analyzed your request. Here is the structured plan and identified services. Would you like to approve this plan or regenerate?" 
      }]);
      setGeneratedPlan(plan);
    } catch (error) {
      setMessages((prev) => [...prev, { 
        role: "ai", 
        content: "Sorry, I ran into an error generating the plan." 
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = () => {
    setActivePlan(generatedPlan);
    setMessages((prev) => [...prev, { 
      role: "user", 
      content: "Looks good, let's approve this." 
    }, {
      role: "ai",
      content: "Great! Your workflow has been approved and saved. It is now the active workspace workflow and you can view its execution graph in the Dashboard."
    }]);
    setGeneratedPlan(null);
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    setGeneratedPlan(null);
    setMessages((prev) => [...prev, { role: "user", content: "Can you regenerate that plan differently?" }]);
    
    const lastUserMsg = messages.filter(m => m.role === "user").pop()?.content || "Generate a workflow";

    try {
      const plan = await workflowService.generateWorkflowPlan(lastUserMsg + " (alternative)");
      setMessages((prev) => [...prev, { 
        role: "ai", 
        content: "Sure, here is an alternative execution plan based on your request. How does this one look?" 
      }]);
      setGeneratedPlan(plan);
    } catch (error) {
      setMessages((prev) => [...prev, { 
        role: "ai", 
        content: "Sorry, I ran into an error." 
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      {/* Chat Interface */}
      <div className="flex-1 flex flex-col bg-card border rounded-lg overflow-hidden shrink-0 shadow-sm">
        <div className="p-4 border-b bg-muted/20">
          <h2 className="font-semibold flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            AI Workflow Assistant
          </h2>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "ai" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                {msg.role === "ai" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={`p-3 rounded-lg text-sm shadow-sm ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted border text-foreground"}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isGenerating && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-lg bg-muted border text-muted-foreground flex items-center gap-2 text-sm shadow-sm">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating plan...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t bg-muted/10">
          <div className="relative">
            <Textarea 
              placeholder="Describe your workflow..." 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="pr-12 bg-background focus-visible:bg-background"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button 
              size="icon" 
              className="absolute bottom-2 right-2"
              disabled={!prompt.trim() || isGenerating}
              onClick={handleSend}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Plan Preview */}
      <div className="w-full lg:w-[400px] flex flex-col gap-4">
        {generatedPlan ? (
          <Card className="flex-1 flex flex-col border-primary/30 shadow-md">
            <div className="p-4 border-b bg-muted/10">
              <h3 className="font-semibold flex items-center gap-2">
                <Network className="w-4 h-4 text-primary" />
                Execution Plan
              </h3>
            </div>
            <CardContent className="flex-1 p-4 overflow-y-auto">
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Identified Services</h4>
                <div className="flex flex-wrap gap-2">
                  {generatedPlan.services.map((svc: string) => (
                    <span key={svc} className="text-xs border px-2.5 py-1 rounded-md bg-accent/50 text-accent-foreground font-medium">
                      {svc}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Parsed Steps</h4>
                <div className="space-y-3 relative">
                  <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />
                  {generatedPlan.steps.map((step: any, index: number) => (
                    <div key={step.id} className="relative z-10 pl-10 pr-4 py-3 border rounded-lg bg-card shadow-sm">
                      <div className="absolute left-[-11px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background border flex items-center justify-center text-xs font-bold text-muted-foreground">
                        {index + 1}
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-primary">{step.action}</span>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-sm">{step.service}</span>
                      </div>
                      <p className="text-sm font-medium">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <div className="p-4 border-t flex flex-col gap-2 bg-muted/10">
              <Button className="w-full" size="lg" onClick={handleApprove}>
                <Check className="w-4 h-4 mr-2" /> Approve Plan
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleRegenerate} disabled={isGenerating}>
                  <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
                </Button>
                <Button variant="outline" className="flex-1" disabled>
                  Edit Steps
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="flex-1 border rounded-lg border-dashed flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-card shadow-sm">
            <Network className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-medium text-foreground mb-1">Waiting for input</p>
            <p className="text-sm">Describe your workflow in the chat to generate an execution plan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
