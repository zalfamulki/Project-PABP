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
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-8 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-grid opacity-[0.4] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[520px] z-10"
      >
        {/* Brand */}
        <div className="flex flex-col items-center mb-10">
          <div className="h-20 w-20 rounded-[2rem] bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/30 mb-6 animate-float">
            <UserPlus className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-black font-heading text-foreground tracking-tighter">
            Join <span className="text-primary">SmartQueue</span>
          </h1>
          <p className="text-text-secondary font-bold uppercase tracking-[0.2em] text-[10px] mt-2 bg-surface-elevated px-4 py-1.5 rounded-full border border-border">
            Create your professional profile
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-surface/60 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-10 shadow-2xl shadow-black/5 relative overflow-hidden group">
          {/* Subtle line decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setValue("role", "customer")}
                className={cn(
                  "flex flex-col items-center gap-3 p-6 rounded-[2rem] border-2 transition-all duration-300 active:scale-95",
                  selectedRole === "customer"
                    ? "border-primary bg-primary text-white shadow-xl shadow-primary/20"
                    : "border-border/50 bg-surface-elevated/50 text-text-secondary hover:border-primary/30 hover:bg-surface"
                )}
              >
                <User className={cn("h-6 w-6 transition-transform duration-500", selectedRole === "customer" && "scale-110")} />
                <span className="text-[10px] font-black uppercase tracking-widest">Customer</span>
              </button>
              <button
                type="button"
                onClick={() => setValue("role", "seller")}
                className={cn(
                  "flex flex-col items-center gap-3 p-6 rounded-[2rem] border-2 transition-all duration-300 active:scale-95",
                  selectedRole === "seller"
                    ? "border-primary bg-primary text-white shadow-xl shadow-primary/20"
                    : "border-border/50 bg-surface-elevated/50 text-text-secondary hover:border-primary/30 hover:bg-surface"
                )}
              >
                <Store className={cn("h-6 w-6 transition-transform duration-500", selectedRole === "seller" && "scale-110")} />
                <span className="text-[10px] font-black uppercase tracking-widest">Seller</span>
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2.5 ml-2">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary group-focus-within:text-primary transition-colors" />
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="Masukan nama anda"
                    className="w-full bg-surface-elevated/50 border border-transparent rounded-2xl py-4 pl-14 pr-6 focus:bg-surface focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-medium"
                  />
                </div>
                {errors.name && <p className="text-danger text-[10px] font-bold mt-2 ml-2 uppercase tracking-wide">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2.5 ml-2">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary group-focus-within:text-primary transition-colors" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="name@example.com"
                    className="w-full bg-surface-elevated/50 border border-transparent rounded-2xl py-4 pl-14 pr-6 focus:bg-surface focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-medium"
                  />
                </div>
                {errors.email && <p className="text-danger text-[10px] font-bold mt-2 ml-2 uppercase tracking-wide">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2.5 ml-2">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary group-focus-within:text-primary transition-colors" />
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-surface-elevated/50 border border-transparent rounded-2xl py-4 pl-14 pr-6 focus:bg-surface focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-medium"
                  />
                </div>
                {errors.password && <p className="text-danger text-[10px] font-bold mt-2 ml-2 uppercase tracking-wide">{errors.password.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-hover text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-3 disabled:opacity-70 active:scale-95 group/btn overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              {isLoading ? <Spinner size="sm" className="border-white" /> : (
                <>
                  <span className="uppercase tracking-[0.2em] text-xs">Buat Akun</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-text-secondary text-L font-large">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-primary font-black hover:underline underline-offset-4">
                Masuk Sekarang
              </Link>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] opacity-40">
          © 2026 SmartQueue Professional • Secure Protocol
        </p>
      </motion.div>
    </div>
  );
}
