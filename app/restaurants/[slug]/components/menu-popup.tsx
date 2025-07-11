"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
}

interface MenuPopupProps {
  item: MenuItem;
  restaurantId: string;
  restaurantName: string;
  deliveryFee: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Menu item popup component that displays detailed information about a menu item
 * 
 * @param props MenuPopupProps
 * @returns JSX.Element
 */
export function MenuPopup({
  item,
  restaurantId,
  restaurantName,
  deliveryFee,
  open,
  onOpenChange,
}: MenuPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{item.name}</DialogTitle>
        </DialogHeader>
        
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10 bg-white/80 hover:bg-white rounded-full"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Image */}
        <div className="relative w-full h-48">
          <Image
            src={item.imageUrl || "/image_placeholder.png"}
            alt={item.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-2">{item.name}</h2>
          
          {item.description && (
            <p className="text-gray-600 mb-4 leading-relaxed">
              {item.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              ${item.price.toFixed(2)}
            </span>
            
            <AddToCartButton
              item={{
                id: item.id,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl || undefined,
              }}
              restaurantId={restaurantId}
              restaurantName={restaurantName}
              deliveryFee={deliveryFee}
              isPopupButton
              onClick={() => onOpenChange(false)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
