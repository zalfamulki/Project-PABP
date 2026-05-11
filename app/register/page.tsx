"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { MonitorPlay, Mail, Lock, ArrowRight, Store, User, UserPlus } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/loading";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["seller", "customer"]),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "customer",
    },
  });

  const selectedRole = watch("role");

  const registerUser = useAuthStore((state) => state.register);

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      toast.success("Account created successfully!");
      router.push(data.role === "seller" ? "/seller" : "/customer");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-8">
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] z-10"
      >
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20 mb-4">
            <UserPlus className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight">
            Create <span className="text-primary">Account</span>
          </h1>
          <p className="text-text-secondary mt-2">Join the future of F&B management</p>
        </div>

        {/* Register Card */}
        <div className="bg-surface border border-border rounded-3xl p-8 shadow-2xl shadow-black/5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setValue("role", "customer")}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                  selectedRole === "customer"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-surface-elevated text-text-secondary hover:border-border/80"
                )}
              >
                <User className="h-6 w-6" />
                <span className="text-sm font-semibold">Customer</span>
              </button>
              <button
                type="button"
                onClick={() => setValue("role", "seller")}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                  selectedRole === "seller"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-surface-elevated text-text-secondary hover:border-border/80"
                )}
              >
                <Store className="h-6 w-6" />
                <span className="text-sm font-semibold">Seller</span>
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="Masukan Nama Anda"
                    className="w-full bg-surface-elevated border-border rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  />
                </div>
                {errors.name && <p className="text-danger text-xs mt-1.5 ml-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="name@example.com"
                    className="w-full bg-surface-elevated border-border rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  />
                </div>
                {errors.email && <p className="text-danger text-xs mt-1.5 ml-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-surface-elevated border-border rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  />
                </div>
                {errors.password && <p className="text-danger text-xs mt-1.5 ml-1">{errors.password.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? <Spinner size="sm" className="border-white" /> : (
                <>
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-text-secondary text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
