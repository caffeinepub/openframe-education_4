import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Atom,
  Award,
  Baby,
  BookMarked,
  BookOpen,
  Calculator,
  CheckCircle,
  ChevronRight,
  ClipboardCheck,
  Code2,
  FileText,
  Globe,
  History,
  LayoutDashboard,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  PlayCircle,
  Settings,
  Shield,
  Star,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import BookDemoModal from "../components/BookDemoModal";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useBlogPosts, useSubmitContact } from "../hooks/useQueries";

// Scroll reveal hook
function useScrollReveal() {
  useEffect(() => {
    const selectors = ".reveal, .reveal-left, .reveal-right";
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("visible");
        }
      },
      { threshold: 0.1 },
    );
    for (const el of document.querySelectorAll(selectors)) observer.observe(el);
    return () => observer.disconnect();
  }, []);
}

// Stars component
function Stars({ rating }: { rating: number }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex gap-0.5">
      {stars.map((n) => (
        <Star
          key={`star-${n}`}
          className={`w-4 h-4 ${n <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

const CLASSES = [
  {
    icon: Baby,
    label: "Nursery",
    desc: "Foundational learning through play & creativity",
    color: "bg-pink-50 text-pink-600",
  },
  {
    icon: BookMarked,
    label: "LKG",
    desc: "Language & number readiness for young learners",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: BookMarked,
    label: "UKG",
    desc: "Pre-primary excellence with structured activities",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: BookOpen,
    label: "Class 1–5",
    desc: "Core subjects with interactive live sessions",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Atom,
    label: "Class 6–10",
    desc: "Board-prep with expert subject teachers",
    color: "bg-teal-50 text-teal-600",
  },
  {
    icon: Calculator,
    label: "Class 11–12",
    desc: "JEE, NEET & Board excellence coaching",
    color: "bg-green-50 text-green-600",
  },
];

const FEATURES = [
  {
    icon: Video,
    num: "01",
    title: "Live Classes",
    desc: "Interactive HD video sessions with top educators in real-time",
  },
  {
    icon: PlayCircle,
    num: "02",
    title: "Recorded Videos",
    desc: "Access 5000+ recorded lectures any time, on any device",
  },
  {
    icon: ClipboardCheck,
    num: "03",
    title: "Attendance Tracking",
    desc: "Automatic daily attendance log shared with parents instantly",
  },
  {
    icon: FileText,
    num: "04",
    title: "Online Exams",
    desc: "Chapter-wise tests, mock exams & instant result analytics",
  },
  {
    icon: Award,
    num: "05",
    title: "Certificates",
    desc: "Verified digital certificates for every completed course",
  },
  {
    icon: LayoutDashboard,
    num: "06",
    title: "Student Dashboard",
    desc: "Personalised learning hub with progress tracking & goals",
  },
  {
    icon: Users,
    num: "07",
    title: "Teacher Dashboard",
    desc: "Class management, schedule, and student performance analytics",
  },
  {
    icon: Settings,
    num: "08",
    title: "Admin Control Panel",
    desc: "Full-platform management: users, payments & reports",
  },
  {
    icon: MapPin,
    num: "09",
    title: "Field Executive Tracking",
    desc: "GPS-enabled check-ins, lead management & daily reports",
  },
];

const PRICING = [
  {
    name: "Basic",
    price: "₹499",
    period: "/month",
    highlight: false,
    features: [
      "Live Classes (5/week)",
      "Recorded Videos",
      "Attendance Tracking",
      "Basic Reports",
      "Email Support",
    ],
    cta: "Get Started",
  },
  {
    name: "Standard",
    price: "₹999",
    period: "/month",
    highlight: true,
    features: [
      "Live Classes (Daily)",
      "Full Video Library",
      "Online Exams",
      "Parent Dashboard",
      "Certificates",
      "Priority Support",
    ],
    cta: "Enroll Now",
  },
  {
    name: "Premium",
    price: "₹1,999",
    period: "/month",
    highlight: false,
    features: [
      "Everything in Standard",
      "1-on-1 Doubt Sessions",
      "JEE / NEET Preparation",
      "Career Counselling",
      "Dedicated Mentor",
      "24/7 Support",
    ],
    cta: "Enroll Now",
  },
];

const TEACHERS = [
  {
    name: "Rajesh Kumar",
    subject: "Mathematics",
    exp: "12 Years",
    rating: 5,
    img: "/assets/generated/teacher-rajesh.dim_200x200.jpg",
  },
  {
    name: "Priya Sharma",
    subject: "Science",
    exp: "9 Years",
    rating: 5,
    img: "/assets/generated/teacher-priya.dim_200x200.jpg",
  },
  {
    name: "Amit Verma",
    subject: "English",
    exp: "8 Years",
    rating: 4,
    img: "/assets/generated/teacher-amit.dim_200x200.jpg",
  },
  {
    name: "Sunita Patel",
    subject: "Social Studies",
    exp: "11 Years",
    rating: 5,
    img: "/assets/generated/teacher-sunita.dim_200x200.jpg",
  },
];

const TESTIMONIALS = [
  {
    name: "Ananya Singh",
    grade: "Class 10",
    review:
      "OpenFrame Education transformed my studies completely. The live classes are super interactive and my marks improved by 30% in just 3 months!",
    rating: 5,
  },
  {
    name: "Rohan Mehta",
    grade: "Class 12 (JEE)",
    review:
      "Best platform for JEE preparation. The doubt sessions and recorded videos helped me solve problems I was stuck on for weeks. Highly recommend!",
    rating: 5,
  },
  {
    name: "Kavya Nair",
    grade: "Class 6",
    review:
      "My daughter loves the classes! The teachers are very patient and explain concepts in such a fun way. Attendance tracking helps us stay on track.",
    rating: 5,
  },
];

const SAMPLE_BLOG = [
  {
    title: "How to Prepare for Board Exams in 60 Days",
    excerpt:
      "A step-by-step action plan from our expert teachers to help students crack board exams with confidence and clarity.",
    category: "Exams",
    img: "/assets/generated/blog-exams.dim_400x250.jpg",
    date: "Mar 15, 2026",
  },
  {
    title: "The Future of Online Education in India",
    excerpt:
      "EdTech is reshaping how 300 million students learn. Here’s how digital classrooms are closing the rural-urban education gap.",
    category: "Education",
    img: "/assets/generated/blog-education.dim_400x250.jpg",
    date: "Mar 10, 2026",
  },
  {
    title: "Top 10 Career Skills Students Need in 2026",
    excerpt:
      "Beyond textbooks: the critical thinking, coding, and communication skills that will define the next generation of leaders.",
    category: "Skills",
    img: "/assets/generated/blog-skills.dim_400x250.jpg",
    date: "Mar 5, 2026",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Exams: "bg-orange-100 text-orange-700",
  Education: "bg-blue-100 text-blue-700",
  Skills: "bg-green-100 text-green-700",
};

export default function HomePage() {
  useScrollReveal();
  const [demoOpen, setDemoOpen] = useState(false);
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const { data: blogPosts } = useBlogPosts();
  const { mutateAsync: submitContact, isPending: contactPending } =
    useSubmitContact();

  const blogs =
    blogPosts && blogPosts.length > 0
      ? blogPosts.slice(0, 3).map((p) => ({
          title: p.title,
          excerpt: p.excerpt,
          category: p.category,
          img: SAMPLE_BLOG[0].img,
          date: new Date(Number(p.publishedAt) / 1_000_000).toLocaleDateString(
            "en-IN",
            { month: "short", day: "numeric", year: "numeric" },
          ),
        }))
      : SAMPLE_BLOG;

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.name || !contact.email || !contact.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      await submitContact({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        message: contact.message,
        createdAt: BigInt(Date.now()) * BigInt(1_000_000),
      });
      toast.success("Message sent! We'll get back to you soon.");
      setContact({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar onBookDemo={() => setDemoOpen(true)} />
      <BookDemoModal open={demoOpen} onOpenChange={setDemoOpen} />

      {/* ========= HERO ========= */}
      <section
        id="home"
        className="hero-gradient pt-16 min-h-[calc(100vh-0px)] flex items-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="reveal-left">
            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { icon: Users, label: "1000+ Students" },
                { icon: Shield, label: "Verified Teachers" },
                { icon: Globe, label: "Live Classes" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="glass flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-primary"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </div>
              ))}
            </div>

            <h1 className="font-poppins font-extrabold text-4xl sm:text-5xl lg:text-[3.25rem] leading-tight text-foreground mb-4">
              Learn Smart, <span className="text-primary">Grow Smart</span> with
              OpenFrame Education.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg">
              Live Online Classes from Nursery to 12th – Affordable, Trusted,
              and Results-Driven. Join 1000+ students learning with India’s best
              teachers.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="rounded-full bg-primary text-white hover:bg-primary/90 font-semibold px-7 shadow-card"
                onClick={() => setDemoOpen(true)}
                data-ocid="hero.primary_button"
              >
                Book Free Demo
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-primary text-primary hover:bg-primary/5 font-semibold px-7"
                onClick={() => {
                  const el = document.querySelector("#features");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                data-ocid="hero.secondary_button"
              >
                <PlayCircle className="mr-2 w-4 h-4" />
                How it Works
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-10">
              {[
                { value: "1000+", label: "Active Students" },
                { value: "50+", label: "Expert Teachers" },
                { value: "98%", label: "Satisfaction Rate" },
                { value: "6", label: "Grade Groups" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-poppins font-extrabold text-2xl text-primary">
                    {s.value}
                  </div>
                  <div className="text-muted-foreground text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right – Hero Image */}
          <div className="reveal-right flex justify-center">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-3xl" />
              <img
                src="/assets/generated/hero-students.dim_800x600.jpg"
                alt="Students learning online"
                className="relative rounded-3xl shadow-card-hover w-full object-cover"
              />
              {/* Floating card */}
              <div className="absolute -bottom-4 -left-4 glass rounded-2xl px-4 py-3 shadow-card">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-poppins font-semibold text-foreground text-sm">
                      Results Improved
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Average 35% score increase
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========= CLASSES ========= */}
      <section id="classes" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10 mb-3">
              Our Classes
            </Badge>
            <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-foreground">
              Classes for Every Stage
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Expert-led live online classes from Nursery through Class 12 —
              tailored to each age group.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CLASSES.map((cls, i) => (
              <div
                key={cls.label}
                className={`reveal reveal-delay-${(i % 4) + 1} card-hover`}
              >
                <Card className="h-full border-border shadow-card hover:shadow-card-hover">
                  <CardContent className="pt-6 flex flex-col gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${cls.color}`}
                    >
                      <cls.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-poppins font-semibold text-foreground text-lg">
                        {cls.label}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        {cls.desc}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-fit text-primary hover:text-primary/80 p-0 h-auto font-medium"
                      data-ocid="classes.secondary_button"
                    >
                      Explore <ChevronRight className="w-4 h-4 ml-0.5" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========= FEATURES ========= */}
      <section id="features" className="py-20 blue-section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10 mb-3">
              Platform Features
            </Badge>
            <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-foreground">
              Everything You Need to Learn & Grow
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              A complete edtech ecosystem built for students, teachers, admins,
              and field teams.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`reveal reveal-delay-${(i % 4) + 1} card-hover`}
              >
                <Card className="h-full bg-white border-border shadow-card">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <f.icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="absolute -top-1 -right-1 text-xs font-bold text-primary/40 font-poppins">
                          {f.num}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-poppins font-semibold text-foreground text-base">
                          {f.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                          {f.desc}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========= DASHBOARD PREVIEW ========= */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10 mb-3">
              Platform Preview
            </Badge>
            <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-foreground">
              Powerful Dashboards for Everyone
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Role-specific dashboards designed to maximise productivity and
              learning outcomes.
            </p>
          </div>
          <div className="reveal">
            <Tabs defaultValue="student">
              <TabsList className="grid grid-cols-4 mb-8 h-auto p-1 bg-muted rounded-xl">
                {["student", "teacher", "admin", "fieldexec"].map((role) => (
                  <TabsTrigger
                    key={role}
                    value={role}
                    className="capitalize rounded-lg py-2.5"
                    data-ocid="dashboard_preview.tab"
                  >
                    {role === "fieldexec"
                      ? "Field Exec"
                      : role.charAt(0).toUpperCase() + role.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Student */}
              <TabsContent value="student">
                <DashboardMockup
                  color="blue"
                  stats={[
                    {
                      label: "Attendance",
                      value: "92%",
                      icon: ClipboardCheck,
                      color: "text-green-600 bg-green-50",
                    },
                    {
                      label: "Classes Done",
                      value: "48",
                      icon: BookOpen,
                      color: "text-blue-600 bg-blue-50",
                    },
                    {
                      label: "Exam Score",
                      value: "87/100",
                      icon: FileText,
                      color: "text-purple-600 bg-purple-50",
                    },
                    {
                      label: "Certificates",
                      value: "3",
                      icon: Award,
                      color: "text-yellow-600 bg-yellow-50",
                    },
                  ]}
                  title="Student Dashboard"
                  subtitle="Track your progress, attendance, exams, and certificates."
                />
              </TabsContent>

              {/* Teacher */}
              <TabsContent value="teacher">
                <DashboardMockup
                  color="indigo"
                  stats={[
                    {
                      label: "Students",
                      value: "38",
                      icon: Users,
                      color: "text-blue-600 bg-blue-50",
                    },
                    {
                      label: "Classes Today",
                      value: "4",
                      icon: Video,
                      color: "text-green-600 bg-green-50",
                    },
                    {
                      label: "Pending Marks",
                      value: "12",
                      icon: ClipboardCheck,
                      color: "text-orange-600 bg-orange-50",
                    },
                    {
                      label: "Avg Score",
                      value: "79%",
                      icon: TrendingUp,
                      color: "text-purple-600 bg-purple-50",
                    },
                  ]}
                  title="Teacher Dashboard"
                  subtitle="Manage classes, track students, and mark attendance."
                />
              </TabsContent>

              {/* Admin */}
              <TabsContent value="admin">
                <DashboardMockup
                  color="violet"
                  stats={[
                    {
                      label: "Total Students",
                      value: "1,024",
                      icon: Users,
                      color: "text-blue-600 bg-blue-50",
                    },
                    {
                      label: "Teachers",
                      value: "52",
                      icon: BookOpen,
                      color: "text-green-600 bg-green-50",
                    },
                    {
                      label: "Demo Bookings",
                      value: "38",
                      icon: FileText,
                      color: "text-purple-600 bg-purple-50",
                    },
                    {
                      label: "Blog Posts",
                      value: "15",
                      icon: Globe,
                      color: "text-teal-600 bg-teal-50",
                    },
                  ]}
                  title="Admin Panel"
                  subtitle="Full control over students, teachers, payments & reports."
                />
              </TabsContent>

              {/* Field Exec */}
              <TabsContent value="fieldexec">
                <DashboardMockup
                  color="teal"
                  stats={[
                    {
                      label: "Check-ins",
                      value: "18",
                      icon: MapPin,
                      color: "text-green-600 bg-green-50",
                    },
                    {
                      label: "Total Leads",
                      value: "64",
                      icon: Users,
                      color: "text-blue-600 bg-blue-50",
                    },
                    {
                      label: "Enrolled",
                      value: "22",
                      icon: CheckCircle,
                      color: "text-teal-600 bg-teal-50",
                    },
                    {
                      label: "Conversion",
                      value: "34%",
                      icon: TrendingUp,
                      color: "text-purple-600 bg-purple-50",
                    },
                  ]}
                  title="Field Executive Panel"
                  subtitle="Manage check-ins, leads, and daily tracking."
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* ========= PRICING ========= */}
      <section id="pricing" className="py-20 blue-section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10 mb-3">
              Pricing
            </Badge>
            <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-foreground">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Choose a plan that fits your learning needs. No hidden charges.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRICING.map((plan, i) => (
              <div
                key={plan.name}
                className={`reveal reveal-delay-${i + 1} card-hover`}
              >
                <Card
                  className={`relative h-full border-2 ${
                    plan.highlight
                      ? "border-primary shadow-card-hover"
                      : "border-border shadow-card"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pt-8 pb-4">
                    <p className="text-muted-foreground text-sm font-medium mb-1">
                      {plan.name}
                    </p>
                    <div className="flex items-end justify-center gap-1">
                      <span className="font-poppins font-extrabold text-4xl text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground mb-1">
                        {plan.period}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-8">
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full rounded-full font-semibold ${
                        plan.highlight
                          ? "bg-primary text-white hover:bg-primary/90"
                          : "border border-primary text-primary bg-white hover:bg-primary/5"
                      }`}
                      variant={plan.highlight ? "default" : "outline"}
                      onClick={() => setDemoOpen(true)}
                      data-ocid="pricing.primary_button"
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========= TEACHERS ========= */}
      <section id="teachers" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10 mb-3">
              Our Educators
            </Badge>
            <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-foreground">
              Learn from the Best
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Our verified teachers bring years of experience, passion, and
              proven results.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEACHERS.map((t, i) => (
              <div
                key={t.name}
                className={`reveal reveal-delay-${i + 1} card-hover`}
              >
                <Card className="text-center border-border shadow-card hover:shadow-card-hover">
                  <CardContent className="pt-8 pb-6">
                    <img
                      src={t.img}
                      alt={t.name}
                      className="w-20 h-20 rounded-full object-cover mx-auto mb-4 ring-4 ring-primary/20"
                    />
                    <h3 className="font-poppins font-semibold text-foreground">
                      {t.name}
                    </h3>
                    <p className="text-primary text-sm font-medium mt-0.5">
                      {t.subject}
                    </p>
                    <p className="text-muted-foreground text-xs mt-1">
                      {t.exp} Experience
                    </p>
                    <div className="flex justify-center mt-2">
                      <Stars rating={t.rating} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========= BLOG (Pragati Magazine) ========= */}
      <section id="blog" className="py-20 blue-section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10 mb-3">
              Pragati Magazine
            </Badge>
            <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-foreground">
              Insights & Inspiration
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Expert articles on education, exam tips, skill building, and
              career guidance.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((post, i) => (
              <div
                key={post.title}
                className={`reveal reveal-delay-${i + 1} card-hover`}
              >
                <Card className="overflow-hidden border-border shadow-card h-full">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-44 object-cover"
                  />
                  <CardContent className="pt-4 pb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-600"}`}
                      >
                        {post.category}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {post.date}
                      </span>
                    </div>
                    <h3 className="font-poppins font-semibold text-foreground leading-snug mb-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-3 p-0 h-auto text-primary font-medium hover:text-primary/80"
                      data-ocid="blog.link"
                    >
                      Read More <ChevronRight className="w-4 h-4 ml-0.5" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========= TESTIMONIALS ========= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10 mb-3">
              Testimonials
            </Badge>
            <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-foreground">
              What Our Students Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className={`reveal reveal-delay-${i + 1}`}>
                <Card className="h-full border-border shadow-card">
                  <CardContent className="pt-6">
                    <Stars rating={t.rating} />
                    <p className="text-muted-foreground text-sm leading-relaxed mt-3 mb-4">
                      &ldquo;{t.review}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-poppins font-bold text-primary">
                        {t.name[0]}
                      </div>
                      <div>
                        <p className="font-poppins font-semibold text-foreground text-sm">
                          {t.name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {t.grade}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========= CONTACT ========= */}
      <section id="contact" className="py-20 blue-section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10 mb-3">
              Contact Us
            </Badge>
            <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-foreground">
              Get in Touch
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Have questions? Our team is ready to help you get started on your
              learning journey.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Info */}
            <div className="reveal-left space-y-6">
              {[
                { icon: Phone, label: "Phone", value: "+91 79964 01388" },
                {
                  icon: Mail,
                  label: "Email",
                  value: "info@openframeeducation.com",
                },
                {
                  icon: MapPin,
                  label: "Address",
                  value:
                    "Ishwar Nagar, Laxmeshwar, Dist. Gadag, Karnataka – 582116",
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-poppins font-semibold text-foreground">
                      {label}
                    </p>
                    <p className="text-muted-foreground text-sm">{value}</p>
                  </div>
                </div>
              ))}
              {/* Map placeholder */}
              <div className="mt-4 rounded-2xl overflow-hidden border border-border shadow-card">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.118!2d77.2090!3d28.6139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzUwLjAiTiA3N8KwMTInMzIuNCJF!5e0!3m2!1sen!2sin!4v1700000000000"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="OpenFrame Education location"
                />
              </div>
            </div>

            {/* Form */}
            <div className="reveal-right">
              <Card className="border-border shadow-card">
                <CardContent className="pt-6">
                  <form onSubmit={handleContact} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="c-name">Full Name *</Label>
                        <Input
                          id="c-name"
                          placeholder="Your name"
                          value={contact.name}
                          onChange={(e) =>
                            setContact((p) => ({ ...p, name: e.target.value }))
                          }
                          className="mt-1"
                          data-ocid="contact.input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="c-phone">Phone</Label>
                        <Input
                          id="c-phone"
                          placeholder="+91 xxxxx"
                          value={contact.phone}
                          onChange={(e) =>
                            setContact((p) => ({ ...p, phone: e.target.value }))
                          }
                          className="mt-1"
                          data-ocid="contact.input"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="c-email">Email *</Label>
                      <Input
                        id="c-email"
                        type="email"
                        placeholder="you@email.com"
                        value={contact.email}
                        onChange={(e) =>
                          setContact((p) => ({ ...p, email: e.target.value }))
                        }
                        className="mt-1"
                        data-ocid="contact.input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="c-msg">Message *</Label>
                      <Textarea
                        id="c-msg"
                        placeholder="How can we help you?"
                        rows={4}
                        value={contact.message}
                        onChange={(e) =>
                          setContact((p) => ({ ...p, message: e.target.value }))
                        }
                        className="mt-1 resize-none"
                        data-ocid="contact.textarea"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={contactPending}
                      className="w-full rounded-full bg-primary text-white font-semibold"
                      data-ocid="contact.submit_button"
                    >
                      {contactPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* WhatsApp Float */}
      <a
        href="https://wa.me/917996401388"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Chat on WhatsApp"
        data-ocid="contact.button"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </a>
    </div>
  );
}

// Dashboard mockup component
function DashboardMockup({
  stats,
  title,
  subtitle,
}: {
  color: string;
  stats: {
    label: string;
    value: string;
    icon: React.ElementType;
    color: string;
  }[];
  title: string;
  subtitle: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
      {/* Browser chrome */}
      <div className="bg-gray-100 border-b border-border px-4 py-2.5 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-4 bg-white rounded-full px-4 py-1 text-xs text-muted-foreground border border-border">
          openframeeducation.com/dashboard
        </div>
      </div>
      {/* Mock content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-poppins font-semibold text-foreground">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-background rounded-xl p-4 border border-border"
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${s.color}`}
              >
                <s.icon className="w-4 h-4" />
              </div>
              <div className="font-poppins font-bold text-xl text-foreground">
                {s.value}
              </div>
              <div className="text-muted-foreground text-xs mt-0.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>
        {/* Mock table row */}
        <div className="mt-4 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              Recent Activity
            </span>
            <span className="text-xs text-primary font-medium cursor-pointer">
              View All
            </span>
          </div>
          {[
            "Mathematics – Chapter 5 Live Class",
            "Science – Mock Test #3",
            "English – Essay Submission",
          ].map((item) => (
            <div
              key={item}
              className="px-4 py-2.5 border-t border-border flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-primary/50" />
              <span className="text-sm text-foreground">{item}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                Today
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
