import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GitGraph, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "../../store/authStore";
import { authService } from "../../services/auth.service";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login({ email, password });
      setAuth(response.user);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to log in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 dark">
      <div className="w-full max-w-[400px] flex flex-col gap-6">
        <div className="flex flex-col items-center text-center gap-2 mb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-2 shadow-inner border border-primary/20">
            <GitGraph className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">DAGWorks</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to orchestrate your AI workflows.</p>
        </div>

        <div className="bg-card border-border border rounded-xl shadow-xl shadow-black/5 p-6">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Email address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border rounded-md px-3 py-2.5 text-sm bg-background/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                placeholder="admin@dagworks.local"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">Password</label>
                <span className="text-xs text-primary cursor-pointer hover:underline font-medium">Forgot?</span>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border rounded-md px-3 py-2.5 text-sm bg-background/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
            <Button disabled={isLoading} type="submit" className="w-full mt-4 py-5 text-sm font-bold shadow-md">
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing In...</>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
            <div className="relative flex justify-center text-xs font-bold uppercase tracking-wider">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full bg-background hover:bg-muted">GitHub</Button>
            <Button variant="outline" className="w-full bg-background hover:bg-muted">Google</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
