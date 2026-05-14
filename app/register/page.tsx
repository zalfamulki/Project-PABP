"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { MonitorPlay, Mail, Lock, ArrowRight, Store, User, UserPlus, CheckCircle2 } from "lucide-react";
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
  const [isSuccess, setIsSuccess] = useState(false);
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
      setIsSuccess(true);
      toast.success("Account created successfully!");
      
      setTimeout(() => {
        router.push(data.role === "seller" ? "/seller" : "/customer");
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* Background Decorative Elements (Global) */}
      <div className="absolute inset-0 bg-grid opacity-[0.2] pointer-events-none" />
      
      {/* Right Side: Visual Panel (Mirrored for Register) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#050505] items-center justify-center overflow-hidden border-l border-white/5 order-2">
        <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/20 via-transparent to-transparent opacity-50" />
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 w-full max-w-xl px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-[1.5rem] overflow-hidden shadow-2xl bg-white/5 backdrop-blur-md p-3 border border-white/10">
                <img src="/logo.png" alt="SmartQueue" className="h-full w-full object-contain" />
              </div>
              <div>
                <h2 className="text-3xl font-black font-heading text-white tracking-tighter">
                  Join <span className="text-blue-400">SmartQueue</span>
                </h2>
                <p className="text-xs text-white/40 font-bold uppercase tracking-[0.3em]">Scalable Business Network</p>
              </div>
            </div>

            {/* Visual Teaser */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 to-transparent blur opacity-25 group-hover:opacity-40 transition duration-1000" />
              <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-3xl bg-black/40 backdrop-blur-sm">
                <img 
                  src="/dashboard-preview.png" 
                  alt="Dashboard Preview" 
                  className="w-full opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                />
                
                {/* Unique Badge for Register */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 right-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <UserPlus className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Network Onboarding</p>
                      <p className="text-xs font-bold text-white">Join 500+ Businesses</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Tagline */}
            <div className="space-y-4">
              <h3 className="text-4xl font-black text-white leading-tight">
                Mulai babak baru<br />
                <span className="text-blue-400">Bisnis anda hari ini.</span>
              </h3>
              <p className="text-white/50 text-lg leading-relaxed max-w-md">
                Bergabunglah dengan ekosistem F&B paling progresif. Efisiensi tanpa batas, pengalaman tanpa kendala.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Left Side: Form Panel (Mirrored for Register) */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 relative z-10 bg-background order-1">
        {/* Subtle Form Side Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
          <div className="absolute top-[15%] left-[10%] w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full animate-pulse" />
          <div className="absolute bottom-[15%] right-[10%] w-80 h-80 bg-purple-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile Brand */}
          <div className="flex flex-col items-center mb-12 lg:hidden">
            <div className="h-16 w-16 rounded-[1.25rem] overflow-hidden shadow-xl mb-4 p-2 bg-surface-elevated border border-border">
              <img src="/logo.png" alt="SmartQueue" className="h-full w-full object-contain" />
            </div>
            <h1 className="text-3xl font-black font-heading text-foreground tracking-tighter text-center">
              Smart<span className="text-blue-500">Queue</span>
            </h1>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">New Account Registration</p>
            </div>
            <h2 className="text-4xl font-black text-foreground mb-3 tracking-tight">Buat Akun <span className="text-blue-500">Profesional</span></h2>
            <p className="text-text-secondary font-medium text-lg">Hanya butuh 2 menit untuk bergabung.</p>
          </div>

          {/* Form */}
          <div className="bg-surface/40 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-black/5 relative overflow-hidden group">
            {/* Gloss effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setValue("role", "customer")}
                  className={cn(
                    "flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300",
                    selectedRole === "customer"
                      ? "border-blue-500 bg-blue-500/10 text-blue-500 shadow-inner"
                      : "border-border/40 bg-surface-elevated/20 text-text-secondary hover:border-blue-500/20"
                  )}
                >
                  <User className="h-5 w-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setValue("role", "seller")}
                  className={cn(
                    "flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300",
                    selectedRole === "seller"
                      ? "border-blue-500 bg-blue-500/10 text-blue-500 shadow-inner"
                      : "border-border/40 bg-surface-elevated/20 text-text-secondary hover:border-blue-500/20"
                  )}
                >
                  <Store className="h-5 w-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Seller</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2 ml-2">Legal Identity</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary transition-colors" />
                    <input
                      {...register("name")}
                      type="text"
                      placeholder="Masukan nama lengkap"
                      className="w-full bg-surface-elevated/40 border border-border/30 rounded-2xl py-4 pl-14 pr-6 focus:bg-surface focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none font-medium"
                    />
                  </div>
                  {errors.name && <p className="text-danger text-[10px] font-bold mt-1.5 ml-2 tracking-tight">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2 ml-2">Email Access</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary transition-colors" />
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="name@example.com"
                      className="w-full bg-surface-elevated/40 border border-border/30 rounded-2xl py-4 pl-14 pr-6 focus:bg-surface focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none font-medium"
                    />
                  </div>
                  {errors.email && <p className="text-danger text-[10px] font-bold mt-1.5 ml-2 tracking-tight">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2 ml-2">Security Key</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary transition-colors" />
                    <input
                      {...register("password")}
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-surface-elevated/40 border border-border/30 rounded-2xl py-4 pl-14 pr-6 focus:bg-surface focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none font-medium"
                    />
                  </div>
                  {errors.password && <p className="text-danger text-[10px] font-bold mt-1.5 ml-2 tracking-tight">{errors.password.message}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className={cn(
                  "w-full font-black py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 active:scale-[0.98] relative overflow-hidden group/btn",
                  isSuccess 
                    ? "bg-success text-white" 
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                )}
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                {isLoading ? (
                  <Spinner size="sm" className="border-white" />
                ) : isSuccess ? (
                  <>
                    <span className="uppercase tracking-[0.2em] text-xs">Onboarded</span>
                    <CheckCircle2 className="h-5 w-5" />
                  </>
                ) : (
                  <>
                    <span className="uppercase tracking-[0.2em] text-xs">Aktivasi Akun</span>
                    <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center relative z-10">
              <p className="text-text-secondary text-sm font-medium">
                Sudah punya akun?{" "}
                <Link href="/login" className="text-blue-500 font-black hover:underline underline-offset-8 decoration-2 transition-all">
                  Masuk Sekarang
                </Link>
              </p>
            </div>
          </div>
          
          <p className="text-center mt-12 text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] opacity-30">
            SmartQueue Network • Secure Registration
          </p>
        </motion.div>
      </div>
    </div>
  );
}
