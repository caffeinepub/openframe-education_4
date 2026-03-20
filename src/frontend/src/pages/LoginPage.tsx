import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Loader2,
  MapPin,
  Settings,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCallerProfile,
  useIsAdmin,
  useSaveProfile,
} from "../hooks/useQueries";

type DashboardRole = "student" | "teacher" | "fieldexec";

const ROLES: {
  id: DashboardRole;
  label: string;
  desc: string;
  icon: React.ElementType;
}[] = [
  {
    id: "student",
    label: "Student",
    desc: "Access classes, exams & certificates",
    icon: BookOpen,
  },
  {
    id: "teacher",
    label: "Teacher",
    desc: "Manage classes, students & attendance",
    icon: Users,
  },
  {
    id: "fieldexec",
    label: "Field Executive",
    desc: "Manage leads, check-ins & tracking",
    icon: MapPin,
  },
];

export default function LoginPage() {
  const { navigate } = useRouter();
  const { login, identity, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useCallerProfile();
  const { data: isAdmin } = useIsAdmin();
  const { mutateAsync: saveProfile, isPending: savePending } = useSaveProfile();

  const [step, setStep] = useState<"login" | "onboard">("login");
  const [selectedRole, setSelectedRole] = useState<DashboardRole>("student");
  const [name, setName] = useState("");

  // After login: check profile & redirect
  useEffect(() => {
    if (!identity || profileLoading) return;
    if (isAdmin) {
      navigate("admin");
      return;
    }
    if (profile) {
      const r = profile.role as DashboardRole;
      if (r === "student" || r === "teacher" || r === "fieldexec") {
        navigate(r);
        return;
      }
    }
    // No profile — show onboarding
    setStep("onboard");
  }, [identity, profile, profileLoading, isAdmin, navigate]);

  const handleLogin = () => {
    login();
  };

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    try {
      await saveProfile({ name: name.trim(), role: selectedRole });
      navigate(selectedRole);
      toast.success(`Welcome, ${name}!`);
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  const isLoading = isLoggingIn || isInitializing || profileLoading;

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 nav-gradient rounded-2xl flex items-center justify-center mb-3 shadow-card">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-poppins font-bold text-2xl text-foreground">
            OpenFrame Education
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your learning journey starts here
          </p>
        </div>

        {step === "login" ? (
          <Card className="shadow-card-hover border-border">
            <CardHeader className="text-center pb-2">
              <CardTitle className="font-poppins text-xl">Sign In</CardTitle>
              <CardDescription>
                Connect with your Internet Identity to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6 flex flex-col gap-4">
              {/* Role preview cards */}
              <div className="grid grid-cols-1 gap-2 mb-2">
                {[
                  ...ROLES,
                  {
                    id: "admin" as const,
                    label: "Admin",
                    desc: "Full platform management",
                    icon: Settings,
                  },
                ].map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted border border-border"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <role.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {role.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {role.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full rounded-full bg-primary text-white font-semibold"
                size="lg"
                data-ocid="login.primary_button"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting…
                  </>
                ) : (
                  "Log In with Internet Identity"
                )}
              </Button>

              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => navigate("home")}
                data-ocid="login.cancel_button"
              >
                <ArrowLeft className="mr-2 w-4 h-4" /> Back to Home
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-card-hover border-border">
            <CardHeader className="text-center pb-2">
              <CardTitle className="font-poppins text-xl">
                Complete Your Profile
              </CardTitle>
              <CardDescription>
                Choose your role and enter your name to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <form onSubmit={handleOnboard} className="space-y-5">
                <div>
                  <Label htmlFor="onboard-name">Your Name *</Label>
                  <Input
                    id="onboard-name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                    data-ocid="login.input"
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Select Your Role *</Label>
                  <div className="space-y-2">
                    {ROLES.map((role) => (
                      <button
                        type="button"
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                          selectedRole === role.id
                            ? "border-primary bg-primary/5"
                            : "border-border bg-white hover:border-primary/50"
                        }`}
                        data-ocid="login.radio"
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            selectedRole === role.id
                              ? "bg-primary text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <role.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-poppins font-semibold text-sm text-foreground">
                            {role.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {role.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={savePending}
                  className="w-full rounded-full bg-primary text-white font-semibold"
                  size="lg"
                  data-ocid="login.submit_button"
                >
                  {savePending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Enter Dashboard"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
