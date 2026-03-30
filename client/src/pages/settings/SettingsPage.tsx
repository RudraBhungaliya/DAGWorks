import { useState } from "react";
import { Save, User, Bell, Shield, Key, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "../../store/authStore";

export function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate network delay
    setTimeout(() => {
      updateUser({ name, email });
      // If we want this to persist across hard reloads, we should update localStorage simulating a backend sync
      const currentSession = localStorage.getItem('auth-session');
      if (currentSession) {
        const session = JSON.parse(currentSession);
        localStorage.setItem('auth-session', JSON.stringify({ ...session, name, email }));
      }
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto h-full flex flex-col gap-8 text-foreground">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and platform preferences.</p>
      </div>

      <div className="grid grid-cols-[250px_1fr] gap-8 items-start">
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-md shadow-sm">
            <User className="w-4 h-4" /> Profile
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors">
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors">
            <Shield className="w-4 h-4" /> Security
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors">
            <Key className="w-4 h-4" /> API Keys
          </button>
        </div>

        <div className="bg-card border rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Profile Information</h2>
            <p className="text-sm text-muted-foreground">Update your personal details.</p>
          </div>
          
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background border px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-primary" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-primary" 
              />
            </div>
          </div>
          
          <div className="p-6 border-t bg-muted/30 flex justify-end">
            <Button className="gap-2" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : showSuccess ? (
                <><Check className="w-4 h-4 text-green-400" /> Saved</>
              ) : (
                <><Save className="w-4 h-4" /> Save Changes</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
