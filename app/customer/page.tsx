"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MenuCard } from "@/components/customer/menu-card";
import { CartBar } from "@/components/customer/cart-bar";
import { useMenuStore } from "@/store/menu-store";
import { Search, Filter, Utensils, Coffee, Sandwich, Pizza } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "All Items", icon: Utensils },
  { id: "Main Course", label: "Main Course", icon: Pizza },
  { id: "Drinks", label: "Drinks", icon: Coffee },
  { id: "Snacks", label: "Snacks", icon: Sandwich },
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
      <div className="space-y-10 pb-32">
        {/* Welcome Header */}
        <div>
          <h1 className="text-4xl font-bold font-heading text-foreground tracking-tight">
            Mau <span className="text-primary underline decoration-primary/20 underline-offset-8">Makan</span> apa hari ini?
          </h1>
          <p className="text-text-secondary mt-3 text-lg">Lihat menu dan mulai pesan</p>
        </div>

        {/* Search & Categories */}
        <div className="space-y-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search for dishes, drinks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border-border rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none shadow-sm text-lg"
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap",
                  selectedCategory === cat.id
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-surface text-text-secondary border border-border hover:border-primary/50"
                )}
              >
                <cat.icon className="h-4 w-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredMenu.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}

          {filteredMenu.length === 0 && !isLoading && (
            <div className="col-span-full py-40 bg-surface-elevated rounded-[3rem] border-2 border-dashed border-border flex flex-col items-center justify-center text-text-secondary text-center px-6">
              <Utensils className="h-16 w-16 mb-6 opacity-10" />
              <h3 className="text-2xl font-bold text-foreground/50">No dishes found</h3>
              <p className="mt-2 text-lg">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      </div>

      <CartBar />
    </DashboardLayout>
  );
}
