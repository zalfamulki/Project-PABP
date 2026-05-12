"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MenuCard } from "@/components/customer/menu-card";
import { CartBar } from "@/components/customer/cart-bar";
import { useMenuStore } from "@/store/menu-store";
import { Search, Utensils, Coffee, Sandwich, Pizza, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "Semua Makanan", icon: Utensils },
  { id: "Main Course", label: "Makanan berat", icon: Pizza },
  { id: "Drinks", label: "Minuman", icon: Coffee },
  { id: "Snacks", label: "Cemilan", icon: Sandwich },
];

export default function CustomerBrowsePage() {
  const { menu, fetchMenu, isLoading } = useMenuStore();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const filteredMenu = menu.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout allowedRole="customer">
      <div className="space-y-8 md:space-y-12 pb-32">
        {/* Welcome Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" />
                Penawaran spesial hari ini
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading text-foreground tracking-tighter leading-[0.9] lg:leading-tight">
              Mau <span className="text-primary underline decoration-primary/20 underline-offset-8">Makan</span><br className="hidden md:block" /> apa hari ini?
            </h1>
            <p className="text-text-secondary mt-6 text-base md:text-lg font-medium leading-relaxed max-w-xl">
              Pesan cepat , praktis dan anti ribet, dijamin sangat memuaskan .
            </p>
          </div>

        </div>

        {/* Search & Categories */}
        <div className="space-y-8">
          <div className="relative max-w-3xl group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-text-secondary group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Cari menu favoritmu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-elevated/50 border border-border/50 rounded-3xl py-5 pl-16 pr-8 focus:bg-surface focus:border-primary/30 focus:ring-8 focus:ring-primary/5 transition-all outline-none text-base md:text-lg font-medium shadow-sm hover:border-primary/20"
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex items-center gap-3 px-6 md:px-8 py-3.5 md:py-4 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 border",
                  selectedCategory === cat.id
                    ? "bg-primary text-white border-primary shadow-xl shadow-primary/30 scale-105"
                    : "bg-surface/50 backdrop-blur-sm text-text-secondary border-border/50 hover:border-primary/50 hover:text-primary"
                )}
              >
                <cat.icon className={cn("h-4 w-4", selectedCategory === cat.id ? "animate-bounce" : "")} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8 pt-4">
          {filteredMenu.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}

          {filteredMenu.length === 0 && !isLoading && (
            <div className="col-span-full py-32 md:py-48 bg-surface-elevated/30 rounded-[3rem] md:rounded-[4rem] border-2 border-dashed border-border/50 flex flex-col items-center justify-center text-text-secondary text-center px-6 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-grid opacity-[0.1] pointer-events-none" />
              <div className="relative z-10">
                <div className="h-20 w-20 md:h-24 md:w-24 rounded-[2rem] bg-surface-elevated flex items-center justify-center mb-8 mx-auto shadow-inner border border-border">
                  <Utensils className="h-8 w-8 md:h-10 md:w-10 opacity-20" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black font-heading text-foreground/40 tracking-tight">tidak ada pesanan</h3>
                <p className="mt-3 text-base md:text-lg font-medium max-w-md mx-auto">Silahkan cek kembali pesanan anda atau coba kategori yang lain</p>
                <button 
                  onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
                  className="mt-8 md:mt-10 text-primary font-black uppercase tracking-widest text-xs hover:underline flex items-center gap-2 mx-auto"
                >
                  bersihkan filter  
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CartBar />
    </DashboardLayout>
  );
}
