import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import { SiFacebook, SiInstagram, SiX, SiYoutube } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const utm = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  return (
    <footer className="footer-gradient text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-poppins font-bold text-white text-lg leading-tight">
                  OpenFrame Education
                </div>
                <div className="text-blue-300 text-xs">
                  Learn Smart, Grow Smart
                </div>
              </div>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
              India's trusted live online learning platform for Nursery to 12th
              grade students. Affordable, verified, and results-driven.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { icon: SiFacebook, label: "Facebook" },
                { icon: SiInstagram, label: "Instagram" },
                { icon: SiYoutube, label: "YouTube" },
                { icon: SiX, label: "Twitter" },
              ].map(({ icon: Icon, label }) => (
                <button
                  type="button"
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-poppins font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2.5 text-blue-200 text-sm">
              {[
                "Live Classes",
                "Recorded Videos",
                "Study Material",
                "Online Exams",
                "Certificates",
              ].map((item) => (
                <li key={item}>
                  <span className="hover:text-white transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-poppins font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2.5 text-blue-200 text-sm">
              {[
                "About Us",
                "Our Teachers",
                "Pragati Magazine",
                "Careers",
                "Privacy Policy",
              ].map((item) => (
                <li key={item}>
                  <span className="hover:text-white transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-poppins font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-3 text-blue-200 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>info@openframeeducation.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>New Delhi, India – 110001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-blue-300 text-sm">
          <p>© {year} OpenFrame Education. All rights reserved.</p>
          <p>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${utm}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-200 hover:text-white transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
