"use client";

import React from "react";
import { Plus, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { JSX } from "react/jsx-runtime";
import { RestaurantForm } from "./restaurant-form";
import type { RestaurantWithUsers } from "@/types/restaurant";

interface RestaurantFormModalProps {
  buttonText?: string;
  restaurant?: RestaurantWithUsers;
  isEdit?: boolean;
  onRestaurantChange?: () => void;
}

/**
 * Restaurant Form Modal Component
 *
 * A modal dialog containing the restaurant form, triggered by a button
 *
 * @param {RestaurantFormModalProps} props - The component props
 * @returns {JSX.Element} The restaurant form modal component
 */
export function RestaurantFormModal({
  buttonText = "Add Restaurant",
  restaurant,
  isEdit = false,
  onRestaurantChange,
}: RestaurantFormModalProps): JSX.Element {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
            <PencilIcon className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Edit</span>
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {buttonText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[95vh] md:max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Restaurant" : "Add New Restaurant"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] md:max-h-[70vh] pr-4">
          <div className="pb-6 px-2">
            <RestaurantForm 
              setOpen={setOpen} 
              restaurant={restaurant}
              onSuccess={() => {
                // Call the callback function when restaurant is successfully created/updated
                if (onRestaurantChange) {
                  onRestaurantChange();
                }
              }}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
