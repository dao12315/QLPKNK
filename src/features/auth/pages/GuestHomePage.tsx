import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/src/app/store/authStore";
import { UserRole } from "@/src/types/auth";
import {
  LogIn,
  Phone,
  Clock,
  MapPin,
  CheckCircle,
  UserPlus,
} from "lucide-react";
import { motion } from "motion/react";

const GuestHomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                D
              </div>
              <span className="font-bold text-xl tracking-tight text-neutral-900">
                DentaCare
              </span>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <button
                  onClick={() =>
                    navigate(
                      user?.role === UserRole.ADMIN ? "/admin" : "/profile",
                    )
                  }
                  className="btn btn-primary"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/register")}
                    className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-blue-600 transition-colors font-medium"
                  >
                    <UserPlus size={18} />
                    Register
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-blue-600 transition-colors font-medium"
                  >
                    <LogIn size={18} />
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6 tracking-tight leading-tight">
              Exceptional Dental Care <br />
              <span className="text-blue-600">For Your Brightest Smile</span>
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-10">
              Modern dentistry with a gentle touch. Our expert team uses the
              latest technology to ensure your comfort and long-term oral
              health.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                Book Appointment
              </button>
              <button className="px-8 py-4 bg-white text-neutral-700 border border-neutral-200 rounded-xl font-semibold hover:bg-neutral-50 transition-colors">
                Our Services
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <CheckCircle className="text-blue-600" />,
                title: "Modern Equipment",
                desc: "State-of-the-art diagnostic and treatment tools for precise care.",
              },
              {
                icon: <CheckCircle className="text-blue-600" />,
                title: "Certified Experts",
                desc: "Our dentists are leaders in their fields with decades of experience.",
              },
              {
                icon: <CheckCircle className="text-blue-600" />,
                title: "Pain-Free Care",
                desc: "Innovative techniques prioritized for your complete comfort.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 bg-neutral-50 rounded-3xl border border-neutral-100"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <footer className="bg-neutral-900 text-neutral-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4 text-white">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                  D
                </div>
                <span className="font-bold text-lg tracking-tight">
                  DentaCare
                </span>
              </div>
              <p className="max-w-md">
                Leading dental clinic specializing in restorative, cosmetic, and
                preventive dentistry for all ages.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Phone size={16} /> (555) 123-4567
                </li>
                <li className="flex items-center gap-2">
                  <Clock size={16} /> Mon-Fri: 8am - 6pm
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={16} /> 123 Health Ave, Clinic City
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Register
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-sm">
            © 2026 DentaCare Clinic. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuestHomePage;
