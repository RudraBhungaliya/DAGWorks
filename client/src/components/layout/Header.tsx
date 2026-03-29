import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 shrink-0 w-full">
      <div className="flex items-center text-muted-foreground bg-accent/50 rounded-md px-3 py-1.5 w-96">
        <Search className="w-4 h-4 mr-2" />
        <input 
          type="text" 
          placeholder="Search workflows, logs..." 
          className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
        </Button>
      </div>
    </header>
  );
}
