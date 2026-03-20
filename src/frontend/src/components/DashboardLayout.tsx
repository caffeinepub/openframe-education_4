import { Button } from "@/components/ui/button";
import { GraduationCap, LogOut, Menu, X } from "lucide-react";
import { type ReactNode, useState } from "react";
import { useRouter } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface SidebarItem {
  icon: ReactNode;
  label: string;
  id: string;
}

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  items: SidebarItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
  children: ReactNode;
}

export default function DashboardLayout({
  title,
  subtitle,
  items,
  activeItem,
  onItemClick,
  children,
}: DashboardLayoutProps) {
  const { navigate } = useRouter();
  const { clear } = useInternetIdentity();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    clear();
    navigate("home");
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
          <GraduationCap className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="font-poppins font-bold text-white text-sm leading-tight">
            OpenFrame
          </div>
          <div className="text-blue-300 text-xs">{subtitle}</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => {
              onItemClick(item.id);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeItem === item.id
                ? "bg-white/20 text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
            data-ocid="nav.link"
          >
            <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-3 pb-5">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
          data-ocid="nav.link"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex flex-col w-60 dashboard-sidebar fixed inset-y-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSidebarOpen(false);
          }}
        />
      )}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-60 dashboard-sidebar flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      <main className="flex-1 md:ml-60 flex flex-col min-h-screen">
        <div className="bg-white border-b border-border px-4 sm:px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-poppins font-semibold text-foreground text-lg">
              {title}
            </h1>
          </div>
        </div>
        <div className="flex-1 p-4 sm:p-6 bg-background">{children}</div>
      </main>
    </div>
  );
}
