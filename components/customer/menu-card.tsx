"use client";

import { MenuItem } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingCart, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { useOrderStore } from "@/store/order-store";
import { cn } from "@/lib/utils";

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
      <Card className="overflow-hidden opacity-60 grayscale-[0.3]">
        <div className="relative h-48 bg-surface-elevated flex items-center justify-center">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="h-10 w-10 text-text-secondary/20" />
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold px-4 py-2 bg-black/60 rounded-full text-sm">
              {isOutOfStock ? "Sold Out" : "Unavailable"}
            </span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-foreground">{item.name}</h3>
          <p className="text-xs text-text-secondary mt-1">{item.category}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden flex flex-col group hover:border-primary/50 transition-all duration-300">
      <div className="relative h-48 bg-surface-elevated flex items-center justify-center overflow-hidden">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <ImageIcon className="h-10 w-10 text-text-secondary/20" />
        )}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-foreground font-bold px-3 py-1.5 rounded-xl text-sm shadow-sm">
            Rp{item.price.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{item.category}</span>
            <span className="text-[10px] font-bold text-text-secondary uppercase">Stock: {item.stock}</span>
          </div>
          <h3 className="text-lg font-bold text-foreground mt-0.5">{item.name}</h3>
          <p className="text-sm text-text-secondary line-clamp-2 mt-1.5 leading-relaxed">{item.description}</p>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between gap-4">
          <div className="flex items-center bg-surface-elevated rounded-xl p-1 border border-border">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1.5 hover:bg-surface rounded-lg transition-colors text-text-secondary"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-sm font-bold">{quantity}</span>
            <button 
              onClick={() => setQuantity(Math.min(item.stock ?? 1, quantity + 1))}
              className="p-1.5 hover:bg-surface rounded-lg transition-colors text-text-secondary"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <Button 
            onClick={handleAdd}
            className="flex-1 rounded-xl h-10 gap-2 shadow-md shadow-primary/10"
          >
            <ShoppingCart className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
}
