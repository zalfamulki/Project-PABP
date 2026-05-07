"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { MonitorPlay, Mail, Lock, ArrowRight, Store, User } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/loading";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["seller", "customer"]),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: "customer",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data.email, data.role);
      toast.success(`Welcome back! Logged in as ${data.role}`);
      router.push(data.role === "seller" ? "/seller" : "/customer");
    } catch (error) {
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-8">
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] z-10"
      >
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20 mb-4">
            <MonitorPlay className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight">
            Smart<span className="text-primary">Queue</span>
          </h1>
          <p className="text-text-secondary mt-2">Manage your F&B experience seamlessly</p>
        </div>

        {/* Login Card */}
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
                  Sign In
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-text-secondary text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
