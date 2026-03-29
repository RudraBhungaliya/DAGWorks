import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export default function MainLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground dark">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto w-full p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
