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
              <Zap className="h-3.5 w-3.5 fill-primary" />
              The Future of F&B is here
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black font-heading text-foreground leading-[1.1] tracking-tight">
              Wait less, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Eat more.</span>
            </h1>
            
            <p className="text-xl text-text-secondary mt-8 leading-relaxed max-w-xl">
              Eliminate physical queues and optimize your restaurant's flow with SmartQueue. Real-time tracking, seamless ordering, and powerful analytics.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-12">
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full h-16 px-10 text-lg rounded-2xl shadow-2xl shadow-primary/30 gap-3 group">
                  Start for Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button variant="outline" className="w-full sm:w-auto h-16 px-10 text-lg rounded-2xl border-2 hover:bg-surface-elevated transition-all">
                View Live Demo
              </Button>
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
                <p className="font-bold text-foreground">5,000+ Merchants</p>
                <p className="text-text-secondary">Trusting SmartQueue daily</p>
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
                <h3 className="text-2xl font-bold font-heading text-foreground">Interactive Dashboard</h3>
                <p className="text-text-secondary mt-3">Ready-to-use interfaces for both Sellers and Customers.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-surface-elevated/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black font-heading text-foreground mb-6">Built for Modern F&B</h2>
            <p className="text-xl text-text-secondary">Everything you need to manage orders and keep customers happy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Zero Lag", desc: "Real-time order synchronization across all devices instantly." },
              { icon: Clock, title: "Smart Est.", desc: "Automated wait-time calculation based on queue density." },
              { icon: Store, title: "Multi-Store", desc: "Manage multiple branches from a single unified dashboard." }
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
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm font-bold text-text-secondary hover:text-primary">Twitter</a>
            <a href="#" className="text-sm font-bold text-text-secondary hover:text-primary">Instagram</a>
            <a href="#" className="text-sm font-bold text-text-secondary hover:text-primary">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
