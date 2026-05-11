"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useOrderStore } from "@/store/order-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/store/toast-store";

export default function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart, placeOrder } = useOrderStore();
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setIsSubmitting(true);
    try {
      const order = await placeOrder(notes);
      toast.success("Order placed successfully!");
      router.push(`/customer/queue?id=${order.id}`);
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <DashboardLayout allowedRole="customer">
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
          <div className="h-24 w-24 rounded-full bg-surface-elevated flex items-center justify-center mb-6">
            <ShoppingBag className="h-10 w-10 text-text-secondary opacity-30" />
          </div>
          <h2 className="text-3xl font-bold font-heading text-foreground">Your cart is empty</h2>
          <p className="text-text-secondary mt-3 text-lg max-w-md">Looks like you haven't added anything to your cart yet. Browse our menu to find something delicious!</p>
          <Link href="/customer">
            <Button className="mt-8 rounded-2xl h-14 px-10 text-lg shadow-xl shadow-primary/20">
              Browse Menu
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRole="customer">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/customer" className="p-3 hover:bg-surface-elevated rounded-2xl transition-colors">
            <ArrowLeft className="h-6 w-6 text-text-secondary" />
          </Link>
          <h1 className="text-3xl font-bold font-heading text-foreground">My Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-2xl bg-surface-elevated flex items-center justify-center text-text-secondary border border-border overflow-hidden">
                    <ShoppingBag className="h-8 w-8 opacity-20" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-primary font-bold">Rp{Number(item.price || 0).toLocaleString('id-ID')}</p>
                      {item.storeName && (
                        <span className="text-[10px] text-text-secondary uppercase font-bold bg-surface-elevated px-2 py-0.5 rounded-lg border border-border">
                          {item.storeName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 self-end sm:self-center">
                  <div className="flex items-center bg-surface-elevated rounded-2xl p-1.5 border border-border">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-surface rounded-xl transition-colors text-text-secondary"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    <span className="w-12 text-center text-lg font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-surface rounded-xl transition-colors text-text-secondary"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="text-right min-w-[100px]">
                    <p className="text-lg font-black text-foreground">Rp{(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString('id-ID')}</p>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-danger text-sm font-bold mt-1 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="p-8 space-y-8 bg-surface-elevated border-none shadow-none">
              <h2 className="text-2xl font-bold font-heading text-foreground border-b border-border pb-4">Summary</h2>
              
              {cart[0]?.storeName && (
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <ShoppingBag className="h-4 w-4" />
                  Ordering from: <span className="font-bold text-foreground">{cart[0].storeName}</span>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="flex justify-between text-text-secondary font-medium">
                  <span>Subtotal</span>
                  <span>Rp{Number(cartTotal || 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-text-secondary font-medium">
                  <span>Queue Fee</span>
                  <span className="text-success font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-foreground pt-4 border-t border-border">
                  <span>Total</span>
                  <span>Rp{Number(cartTotal || 0).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Order Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions?"
                  className="w-full bg-surface border-border rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full h-16 rounded-[1.5rem] text-lg font-bold shadow-xl shadow-primary/20 gap-3"
              >
                {isSubmitting ? "Processing..." : (
                  <>
                    Confirm Order
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-text-secondary leading-relaxed px-4">
                By confirming, you agree to join the queue. You will be notified when your order is ready.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
