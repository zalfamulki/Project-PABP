"use client";

import { useOrderStore } from "@/store/order-store";
import { formatCurrency } from "@/lib/utils";
import { Price } from "@/components/ui/price";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function CartBar() {
  const { cart, cartTotal } = useOrderStore();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-6"
        >
          <div className="bg-foreground text-surface rounded-[2rem] p-4 pl-8 shadow-2xl shadow-black/20 flex items-center justify-between group">
            <div className="flex items-center gap-6">
              <div className="relative">
                <ShoppingBag className="h-6 w-6 text-primary" />
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center ring-2 ring-foreground">
                  {itemCount}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-surface/40">Checkout Total</p>
                <Price amount={Number(cartTotal || 0)} className="text-xl text-white" />
              </div>
            </div>

            <Link 
              href="/customer/cart"
              className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-[1.5rem] font-bold flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Checkout Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
