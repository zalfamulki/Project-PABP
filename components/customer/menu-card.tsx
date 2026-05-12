"use client";

import { MenuItem } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ShoppingCart, Image as ImageIcon, Store } from "lucide-react";
import { useState } from "react";
import { useOrderStore } from "@/store/order-store";
import { cn } from "@/lib/utils";
import { Price } from "@/components/ui/price";

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useOrderStore((state) => state.addToCart);

  const handleAdd = () => {
    addToCart(item, quantity);
    setQuantity(1); // Reset local quantity
  };

  const isOutOfStock = (item.stock ?? 0) <= 0;
  const isUnavailable = !item.isAvailable || isOutOfStock;

  if (isUnavailable) {
    return (
      <Card className="overflow-hidden opacity-60 grayscale-[0.3] flex flex-col h-full border-border/50 bg-surface/30">
        <div className="relative h-48 md:h-56 bg-surface-elevated flex items-center justify-center">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="h-10 w-10 text-text-secondary/20" />
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
            <span className="text-white font-black px-6 py-2.5 bg-black/60 rounded-2xl text-xs uppercase tracking-widest border border-white/20">
              {isOutOfStock ? "Sold Out" : "Unavailable"}
            </span>
          </div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">{item.category}</span>
          </div>
          <h3 className="text-xl font-black font-heading text-foreground tracking-tight line-clamp-1">{item.name}</h3>
          <p className="text-sm text-text-secondary line-clamp-2 mt-4 leading-relaxed italic">Currently not available for order</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden flex flex-col h-full group hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 bg-surface/50 backdrop-blur-sm border-border/50">
      <div className="relative h-48 md:h-56 bg-surface-elevated flex items-center justify-center overflow-hidden">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="flex flex-col items-center gap-3 opacity-20">
            <ImageIcon className="h-10 w-10" />
            <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute top-4 left-4">
          <Badge variant="success" className="shadow-lg backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
            In Stock
          </Badge>
        </div>

        <div className="absolute bottom-4 right-4">
          <div className="bg-white/90 backdrop-blur-md text-foreground px-4 py-2 rounded-2xl border border-border shadow-lg">
            <Price amount={item.price} className="text-sm" />
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{item.category}</span>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] font-black text-text-secondary uppercase">Stock: {item.stock}</span>
            </div>
          </div>
          
          <h3 className="text-xl font-black font-heading text-foreground tracking-tight group-hover:text-primary transition-colors line-clamp-1">{item.name}</h3>
          
          {item.storeName && (
            <div className="flex items-center gap-1.5 mt-2">
              <Store className="h-3.5 w-3.5 text-text-secondary" />
              <p className="text-[10px] text-text-secondary font-black uppercase tracking-wider">{item.storeName}</p>
            </div>
          )}
          
          <div className="mt-4 min-h-[2.5rem]">
            <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">{item.description || "No description available for this delicious item."}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center justify-center bg-surface-elevated rounded-2xl p-1 border border-border/50 shadow-inner">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-surface rounded-xl transition-all active:scale-90 text-text-secondary hover:text-foreground"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center text-sm font-black">{quantity}</span>
            <button 
              onClick={() => setQuantity(Math.min(item.stock ?? 1, quantity + 1))}
              className="p-2 hover:bg-surface rounded-xl transition-all active:scale-90 text-text-secondary hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <Button 
            onClick={handleAdd}
            className="flex-1 rounded-[1.25rem] h-12 gap-3 shadow-xl shadow-primary/20 group/btn"
          >
            <ShoppingCart className="h-4 w-4 transition-transform group-hover/btn:-rotate-12" />
            <span className="text-xs font-black uppercase tracking-widest">Add to Order</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
