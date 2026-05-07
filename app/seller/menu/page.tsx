"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useMenuStore } from "@/store/menu-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  UtensilsCrossed, 
  Search, 
  Eye, 
  EyeOff,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const menuItemSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  category: z.string().min(2, "Category is required"),
  imageUrl: z.string().url("Must be a valid image URL"),
});

type MenuItemFormValues = z.infer<typeof menuItemSchema>;

export default function MenuManagementPage() {
  const { menu, fetchMenu, addMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability, isLoading } = useMenuStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      imageUrl: "",
    }
  });

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const openAddModal = () => {
    setEditingItem(null);
    reset({ name: "", description: "", price: 0, category: "", imageUrl: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item.id);
    reset({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl || "",
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: MenuItemFormValues) => {
    if (editingItem) {
      await updateMenuItem(editingItem, data);
    } else {
      await addMenuItem({ ...data, isAvailable: true } as any);
    }
    setIsModalOpen(false);
  };

  const filteredMenu = menu.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout allowedRole="seller">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading text-foreground">Menu Management</h1>
            <p className="text-text-secondary mt-1">Manage your dishes, prices, and availability.</p>
          </div>
          <Button onClick={openAddModal} className="rounded-xl gap-2 h-12 px-6 shadow-lg shadow-primary/20">
            <Plus className="h-5 w-5" />
            Add New Item
          </Button>
        </div>

        {/* Search & Stats */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border-border rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-surface-elevated rounded-xl border border-border">
              <span className="text-xs text-text-secondary block font-medium">Total Items</span>
              <span className="text-lg font-bold text-foreground">{menu.length}</span>
            </div>
            <div className="px-4 py-2 bg-surface-elevated rounded-xl border border-border">
              <span className="text-xs text-text-secondary block font-medium">Available</span>
              <span className="text-lg font-bold text-success">{menu.filter(m => m.isAvailable).length}</span>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMenu.map((item) => (
            <Card key={item.id} className={cn(
              "overflow-hidden flex flex-col group transition-all duration-300",
              !item.isAvailable && "opacity-75 grayscale-[0.5]"
            )}>
              <div className="relative h-48 bg-surface-elevated flex items-center justify-center overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <ImageIcon className="h-12 w-12 text-text-secondary/20" />
                )}
                <div className="absolute top-4 right-4">
                  <Badge variant={item.isAvailable ? "success" : "default"} className="shadow-lg backdrop-blur-md">
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-foreground">{item.name}</h3>
                  <span className="text-lg font-bold text-primary">${item.price.toLocaleString()}</span>
                </div>
                <p className="text-sm text-text-secondary line-clamp-2 mb-4 flex-1">{item.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">{item.category}</span>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => toggleAvailability(item.id)}
                      className="p-2 hover:bg-surface-elevated rounded-xl text-text-secondary hover:text-foreground transition-colors"
                      title={item.isAvailable ? "Make unavailable" : "Make available"}
                    >
                      {item.isAvailable ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </button>
                    <button 
                      onClick={() => openEditModal(item)}
                      className="p-2 hover:bg-surface-elevated rounded-xl text-text-secondary hover:text-primary transition-colors"
                      title="Edit item"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => deleteMenuItem(item.id)}
                      className="p-2 hover:bg-danger/10 rounded-xl text-text-secondary hover:text-danger transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {filteredMenu.length === 0 && (
            <div className="col-span-full py-32 bg-surface-elevated rounded-[2.5rem] border-2 border-dashed border-border flex flex-col items-center justify-center text-text-secondary">
              <UtensilsCrossed className="h-16 w-16 mb-4 opacity-10" />
              <h3 className="text-xl font-bold text-foreground/50">No dishes found</h3>
              <p className="mt-1">Start by adding your first menu item.</p>
              <Button variant="ghost" className="mt-6 text-primary" onClick={openAddModal}>
                Add Menu Item
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Edit Menu Item" : "Add New Dish"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 md:col-span-2">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Item Name</label>
                <input
                  {...register("name")}
                  placeholder="e.g. Signature Burger"
                  className="w-full bg-surface-elevated border-border rounded-2xl py-3.5 px-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
                {errors.name && <p className="text-danger text-xs mt-1.5">{errors.name.message}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Price</label>
                <input
                  {...register("price")}
                  type="number"
                  step="1"
                  placeholder="45000"
                  className="w-full bg-surface-elevated border-border rounded-2xl py-3.5 px-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
                {errors.price && <p className="text-danger text-xs mt-1.5">{errors.price.message}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Category</label>
                <input
                  {...register("category")}
                  placeholder="e.g. Main Course"
                  className="w-full bg-surface-elevated border-border rounded-2xl py-3.5 px-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
                {errors.category && <p className="text-danger text-xs mt-1.5">{errors.category.message}</p>}
              </div>
            </div>

            <div className="space-y-4 md:col-span-2">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Image URL</label>
                <input
                  {...register("imageUrl")}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-surface-elevated border-border rounded-2xl py-3.5 px-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
                {errors.imageUrl && <p className="text-danger text-xs mt-1.5">{errors.imageUrl.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Description</label>
                <textarea
                  {...register("description")}
                  rows={3}
                  placeholder="Describe your delicious dish..."
                  className="w-full bg-surface-elevated border-border rounded-2xl py-3.5 px-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                />
                {errors.description && <p className="text-danger text-xs mt-1.5">{errors.description.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading} className="px-8">
              {isLoading ? "Saving..." : editingItem ? "Update Item" : "Create Item"}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
