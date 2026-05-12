"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  MonitorPlay, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Smartphone,
  Star,
  ChevronRight,
  Store,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden selection:bg-primary/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <MonitorPlay className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black font-heading text-foreground tracking-tighter">
              Smart<span className="text-primary">Queue</span>
            </span>
          </div>

       
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-bold text-sm px-6">Log In</Button>
            </Link>
            <Link href="/register">
              <Button className="font-bold text-sm px-8 rounded-xl shadow-lg shadow-primary/20">Get Started</Button>
            </Link>
          </div>
        </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-40 pb-20 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8">
              
             Masa depan FnB ada  disini
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black font-heading text-foreground leading-[1.1] tracking-tight">
             Solusi, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Antrian Modern.</span>
            </h1>
            
            <p className="text-xl text-text-secondary mt-8 leading-relaxed max-w-xl">
              sistem pre-order dan antrian adaptif berbasis   multiplatform yang dirancang untuk membantu UMKM kuliner mengelola pesanan secara lebih efisien dan modern. Aplikasi ini memungkinkan pelanggan melakukan pemesanan makanan secara online, memantau posisi antrian, serta mendapatkan estimasi waktu pesanan secara real-time.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-12">
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full h-16 px-10 text-lg rounded-2xl shadow-2xl shadow-primary/30 gap-3 group">
                  Start for Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
          
            </div>

            <div className="flex items-center gap-8 mt-12 pt-12 border-t border-border">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-12 w-12 rounded-full border-4 border-background bg-surface-elevated flex items-center justify-center text-text-secondary font-bold text-xs overflow-hidden">
                    <Users className="h-5 w-5" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-bold text-foreground">500+ UMKM</p>
                <p className="text-text-secondary">UMKM yang terbantu</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 bg-surface border border-border rounded-[2.5rem] p-4 shadow-2xl overflow-hidden aspect-[4/3] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <div className="text-center p-12">
                <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold font-heading text-foreground">Dashboard Interaktif</h3>
                <p className="text-text-secondary mt-3">Interface siap pakai untuk Penjual dan Pelanggan .</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-surface-elevated/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black font-heading text-foreground mb-6">Dirancang Untuk UMKM Modern</h2>
            <p className="text-xl text-text-secondary">Semua yang anda butuhkan untuk mengelola pesanan dan menjaga kepuasan pelanggan .</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Tanpa Lag", desc: "sinkronisasi pesanan real-time di semua perangkat secara instan." },
              { icon: Clock, title: "Estimasi Cerdas", desc: "kalkulasi waktu tunggu otomatis berdasarkan kepadatan antrian." },
              { icon: Store, title: "Multi-Store", desc: "kelola berbagai cabang dari satu dashboard terpadu." }
            ].map((feature, i) => (
              <div key={i} className="p-10 bg-surface rounded-[2rem] border border-border hover:border-primary/50 transition-all hover:shadow-xl group">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold font-heading text-foreground mb-4">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <MonitorPlay className="h-5 w-5" />
            </div>
            <span className="text-xl font-black font-heading text-foreground">
              Smart<span className="text-primary">Queue</span>
            </span>
          </div>
          
          <p className="text-sm text-text-secondary">© 2026 SmartQueue F&B+. All rights reserved.</p>
          
  
        </div>
      </footer>
    </div>
  );
}
