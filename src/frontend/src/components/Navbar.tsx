import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Classes", href: "#classes" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Teachers", href: "#teachers" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

interface NavbarProps {
  onBookDemo: () => void;
}

export default function Navbar({ onBookDemo }: NavbarProps) {
  const { navigate } = useRouter();
  const { identity, clear } = useInternetIdentity();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const isLoggedIn = !!identity;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 nav-gradient transition-shadow duration-300 ${
        scrolled ? "shadow-nav" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            type="button"
            className="flex items-center gap-2.5 group"
            onClick={() => navigate("home")}
            data-ocid="nav.link"
          >
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="font-poppins font-bold text-white text-base leading-tight">
                OpenFrame
              </div>
              <div className="font-poppins text-blue-200 text-xs leading-tight">
                Education
              </div>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="px-3 py-2 text-white/85 hover:text-white text-sm font-medium transition-colors rounded-lg hover:bg-white/10"
                data-ocid="nav.link"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 hover:text-white border border-white/30 rounded-full px-4"
                onClick={() => clear()}
                data-ocid="nav.link"
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 hover:text-white border border-white/30 rounded-full px-4"
                onClick={() => navigate("login")}
                data-ocid="nav.link"
              >
                Log In
              </Button>
            )}
            <Button
              size="sm"
              className="bg-white text-primary hover:bg-blue-50 rounded-full px-5 font-semibold"
              onClick={onBookDemo}
              data-ocid="nav.primary_button"
            >
              Book Demo
            </Button>
          </div>

          <button
            type="button"
            className="lg:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-[#0A2A52] border-t border-white/10 px-4 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <button
              type="button"
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="block w-full text-left px-4 py-2.5 text-white/85 hover:text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors"
              data-ocid="nav.link"
            >
              {link.label}
            </button>
          ))}
          <div className="flex gap-2 pt-2">
            {isLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-white/30 text-white hover:bg-white/10 rounded-full"
                onClick={() => {
                  clear();
                  setMobileOpen(false);
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-white/30 text-white hover:bg-white/10 rounded-full"
                onClick={() => {
                  navigate("login");
                  setMobileOpen(false);
                }}
              >
                Log In
              </Button>
            )}
            <Button
              size="sm"
              className="flex-1 bg-white text-primary hover:bg-blue-50 rounded-full font-semibold"
              onClick={() => {
                onBookDemo();
                setMobileOpen(false);
              }}
            >
              Book Demo
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
