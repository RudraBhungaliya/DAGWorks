import { AlertCircle, Check, X, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ApprovalModalProps {
  isOpen: boolean;
  onApprove: () => void;
  onReject: () => void;
}

export function ApprovalModal({ isOpen, onApprove, onReject }: ApprovalModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-card w-full max-w-lg rounded-xl shadow-2xl border p-0 overflow-hidden flex flex-col"
          >
            <div className="p-6 pb-4 border-b flex items-start gap-4 bg-destructive/5">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Action Requires Approval</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Workflow <strong>#wf-142</strong> is attempting to perform a sensitive action.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4 text-sm">
          <div className="grid grid-cols-[120px_auto] gap-y-3">
            <div className="text-muted-foreground font-medium">Service</div>
            <div className="font-semibold flex items-center gap-2">
              <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" className="w-4 h-4 bg-white rounded-sm" />
              GitHub
            </div>
            
            <div className="text-muted-foreground font-medium">Action</div>
            <div className="font-semibold">Create Repository Branch</div>
            
            <div className="text-muted-foreground font-medium">Requested By</div>
            <div className="font-semibold">AI Agent (Node #2)</div>
          </div>

          <div className="pt-4 mt-2 border-t text-xs">
            <div className="flex items-center font-bold uppercase tracking-wider text-muted-foreground gap-2 mb-2">
              <ShieldAlert className="w-3.5 h-3.5" /> Payload Preview
            </div>
            <pre className="bg-zinc-950 text-zinc-300 p-3 flex rounded-md font-mono overflow-x-auto border border-zinc-800 shadow-inner">
              {JSON.stringify({
                repo: "DAGWorks/core",
                base: "main",
                head: "fix/PROJ-123",
                commit_message: "Automated fix applied by DAGWorks"
              }, null, 2)}
            </pre>
          </div>
        </div>

        <div className="p-4 border-t bg-muted/20 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onReject}>
            <X className="w-4 h-4 mr-2" /> Reject Action
          </Button>
          <Button variant="default" className="bg-green-600 hover:bg-green-700 text-white border-transparent" onClick={onApprove}>
            <Check className="w-4 h-4 mr-2" /> Approve Action
          </Button>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
