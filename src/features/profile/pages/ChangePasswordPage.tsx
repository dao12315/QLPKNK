import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/src/app/store/authStore";
import { Breadcrumb } from "@/src/shared/components/ui/Breadcrumb";
import { Button } from "@/src/shared/components/ui/Button";
import { Input } from "@/src/shared/components/ui/Input";
import { useUIStore } from "@/src/app/store/uiStore";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Min 8 characters")
      .regex(/[A-Z]/, "Must have uppercase")
      .regex(/[a-z]/, "Must have lowercase")
      .regex(/[0-9]/, "Must have number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different",
    path: ["newPassword"],
  });

type FormData = z.infer<typeof changePasswordSchema>;

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const addAlert = useUIStore((state) => state.addAlert);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const newPwd = watch("newPassword", "");

  const getStrength = (pwd: string) => {
    if (!pwd)
      return { label: "Empty", color: "var(--neutral-200)", width: "0%" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2)
      return { label: "Weak", color: "var(--danger-color)", width: "33%" };
    if (score <= 4)
      return { label: "Medium", color: "var(--warning-color)", width: "66%" };
    return { label: "Strong", color: "var(--success-color)", width: "100%" };
  };

  const strength = getStrength(newPwd);

  const onSubmit = async (data: FormData) => {
    try {
      // API Simulate
      await new Promise((r) => setTimeout(r, 1500));
      addAlert("Password changed successfully. Please login again.", "success");
      logout();
      navigate("/login");
    } catch (err) {
      addAlert(
        "Failed to change password. Please check current password.",
        "error",
      );
    }
  };

  return (
    <div className="change-pwd-page">
      <div className="container-narrow">
        <Breadcrumb
          items={[
            { label: "Profile", path: "/profile" },
            { label: "Change Password" },
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card shadow-md"
        >
          <div className="card-header">
            <ShieldCheck size={28} className="icon-blue" />
            <div className="header-text">
              <h1 className="title">Security Settings</h1>
              <p className="subtitle">Update your account password</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div className="form-group">
              <Input
                label="Current Password"
                type={showCurrent ? "text" : "password"}
                {...register("currentPassword")}
                error={errors.currentPassword?.message}
                icon={<Lock size={18} />}
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="form-group">
              <Input
                label="New Password"
                type={showNew ? "text" : "password"}
                {...register("newPassword")}
                error={errors.newPassword?.message}
                icon={<Lock size={18} />}
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              <div className="strength-meter">
                <div className="meter-bg">
                  <div
                    className="meter-fill"
                    style={{
                      width: strength.width,
                      background: strength.color,
                    }}
                  ></div>
                </div>
                <span
                  className="strength-label"
                  style={{ color: strength.color }}
                >
                  Strength: {strength.label}
                </span>
              </div>
            </div>

            <div className="form-group">
              <Input
                label="Confirm New Password"
                type={showConfirm ? "text" : "password"}
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
                icon={<Lock size={18} />}
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="actions">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Save Changes
              </Button>
            </div>
          </form>
        </motion.div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .change-pwd-page { padding: 2rem 1rem; min-height: 100vh; background: var(--neutral-50); }
        .container-narrow { max-width: 32rem; margin: 0 auto; }
        
        .card { background: white; padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--neutral-100); }
        .card-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .header-text { flex: 1; }
        .title { font-size: 1.25rem; font-weight: 800; color: var(--neutral-900); }
        .subtitle { font-size: 0.875rem; color: var(--neutral-500); }
        
        .form { display: flex; flex-direction: column; gap: 1.25rem; }
        .form-group { position: relative; }
        .toggle-btn { position: absolute; right: 1rem; top: 2.125rem; color: var(--neutral-400); padding: 0.25rem; border-radius: 0.5rem; }
        .toggle-btn:hover { color: var(--neutral-600); background: var(--neutral-50); }
        
        .strength-meter { margin-top: 0.5rem; }
        .meter-bg { height: 0.25rem; background: var(--neutral-100); border-radius: 999px; overflow: hidden; }
        .meter-fill { height: 100%; transition: width 0.3s ease, background 0.3s ease; }
        .strength-label { font-size: 0.625rem; font-weight: 700; text-transform: uppercase; margin-top: 0.25rem; display: block; }
        
        .actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; padding-top: 1.5rem; border-top: 1px solid var(--neutral-50); }
        .icon-blue { color: var(--primary-color); }
      `,
        }}
      />
    </div>
  );
};

export default ChangePasswordPage;
