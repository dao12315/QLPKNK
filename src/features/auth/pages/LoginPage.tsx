import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/src/app/store/authStore";
import { UserRole } from "@/src/types/auth";
import { motion } from "motion/react";
import { Lock, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { authService } from "@/src/services/authService";

// ================= SCHEMA =================
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ================= ROLE HELPERS =================
const mapRole = (role: string): UserRole => {
  // nếu backend trả ROLE_ADMIN thì normalize luôn
  const normalized = role.replace("ROLE_", "");

  if (["admin", "dentist", "receptionist"].includes(normalized)) {
    return UserRole.ADMIN;
  }
  return UserRole.USER;
};

const isAdmin = (role: UserRole) => role === UserRole.ADMIN;

// ================= COMPONENT =================
const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth, isAuthenticated, isHydrated } = useAuthStore();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ================= REDIRECT IF LOGGED =================
  useEffect(() => {
    if (!isHydrated) return;

    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isHydrated, navigate]);

  // ================= SUBMIT =================
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await authService.login({
        email: data.email,
        password: data.password,
      });

      const { accessToken, refreshToken, user } = res.data;

      const role = mapRole(user.role);

      setAuth(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          role,
        },
        accessToken,
        refreshToken,
      );
      console.log("AUTH STORE AFTER LOGIN:", useAuthStore.getState());

      navigate(isAdmin(role) ? "/admin" : "/profile");
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.message || "Sai tài khoản hoặc mật khẩu";

      // ❌ không dùng alert nữa
      setError("root", {
        type: "server",
        message,
      });
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-neutral-200/50 border border-neutral-100">
          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="relative">
              <button
                onClick={() => navigate("/")}
                className="absolute left-0 top-0 flex items-center gap-2 text-sm text-neutral-500 hover:text-blue-600 transition"
              >
                <ArrowLeft size={18} />
                Back
              </button>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              D
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-neutral-500 mt-1">
              Sign in to manage your dental care
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* GLOBAL ERROR */}
            {errors.root && (
              <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {errors.root.message}
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  size={18}
                />
                <input
                  {...register("email")}
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-60"
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 px-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  size={18}
                />
                <input
                  {...register("password")}
                  type="password"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-60"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 px-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
              {!isSubmitting && (
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              )}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
            <p className="text-sm text-neutral-500">
              Don’t have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-blue-600 font-medium hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
