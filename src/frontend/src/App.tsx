import { Toaster } from "@/components/ui/sonner";
import { createContext, useContext, useEffect, useState } from "react";
import AdminDashboard from "./pages/AdminDashboard";
import FieldExecDashboard from "./pages/FieldExecDashboard";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

export type Route =
  | "home"
  | "login"
  | "student"
  | "teacher"
  | "admin"
  | "fieldexec";

type RouterCtx = {
  route: Route;
  navigate: (r: Route) => void;
};

const RouterContext = createContext<RouterCtx>({
  route: "home",
  navigate: () => {},
});

export function useRouter() {
  return useContext(RouterContext);
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 hero-gradient flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center gap-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl nav-gradient flex items-center justify-center">
            <span className="text-white font-poppins font-bold text-lg">
              OF
            </span>
          </div>
          <span className="font-poppins font-bold text-2xl text-foreground">
            OpenFrame Education
          </span>
        </div>
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground font-medium">
          Loading your learning experience…
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState<Route>("home");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <RouterContext.Provider value={{ route, navigate: setRoute }}>
      <Toaster position="top-right" richColors />
      {route === "home" && <HomePage />}
      {route === "login" && <LoginPage />}
      {route === "student" && <StudentDashboard />}
      {route === "teacher" && <TeacherDashboard />}
      {route === "admin" && <AdminDashboard />}
      {route === "fieldexec" && <FieldExecDashboard />}
    </RouterContext.Provider>
  );
}
