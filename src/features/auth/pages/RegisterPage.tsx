import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Mail,
  Lock,
  Phone,
  MapPin,
  Calendar,
  Activity,
  UserCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/src/shared/components/ui/Button";
import { Input } from "@/src/shared/components/ui/Input";

const registerSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Invalid phone number"),
  gender: z.enum(["male", "female", "other"]),
  dob: z.string().min(1, "Date of birth is required"),
  address: z.string().min(5, "Address is too short"),
  medicalHistory: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      gender: "male",
      dob: "2000-01-01",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    console.log(data);
    await new Promise((r) => setTimeout(r, 1500));
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-neutral-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-neutral-200 p-8"
      >
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
          <div className="w-12 h-12 mx-auto mb-3 bg-blue-600 text-white flex items-center justify-center rounded-xl font-bold">
            D
          </div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Create Account
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Join DentaCare for better dental care
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              {...register("name")}
              error={errors.name?.message}
              icon={<UserCircle size={18} />}
              placeholder="Nguyen Van A"
            />

            <Input
              label="Email"
              {...register("email")}
              error={errors.email?.message}
              icon={<Mail size={18} />}
            />

            <Input
              label="Password"
              type="password"
              {...register("password")}
              error={errors.password?.message}
              icon={<Lock size={18} />}
            />

            <Input
              label="Phone"
              {...register("phone")}
              error={errors.phone?.message}
              icon={<Phone size={18} />}
            />

            {/* SELECT */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-neutral-700">
                Gender
              </label>
              <select
                {...register("gender")}
                className="h-11 px-3 rounded-xl border border-neutral-300 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-xs text-red-500">{errors.gender.message}</p>
              )}
            </div>

            <Input
              label="Date of Birth"
              type="date"
              {...register("dob")}
              error={errors.dob?.message}
              icon={<Calendar size={18} />}
            />

            <div className="sm:col-span-2">
              <Input
                label="Address"
                {...register("address")}
                error={errors.address?.message}
                icon={<MapPin size={18} />}
              />
            </div>

            {/* TEXTAREA */}
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="text-sm font-medium text-neutral-700">
                Medical History
              </label>
              <div className="relative">
                <Activity
                  size={18}
                  className="absolute left-3 top-3 text-neutral-400"
                />
                <textarea
                  {...register("medicalHistory")}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-300 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  placeholder="None"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full mt-4"
            size="lg"
          >
            Register Account
          </Button>
        </form>

        {/* FOOTER */}
        <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
          <p className="text-sm text-neutral-500">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 font-medium hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
