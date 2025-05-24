"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MenuItemForm } from "@/app/restaurant/menu/components/menu-item-form";
import { JSX } from "react/jsx-runtime";

interface MenuItemFormModalProps {
  buttonText?: string;
}

/**
 * Menu Item Form Modal Component
 *
 * A modal dialog containing the menu item form, triggered by a button
 *
 * @param {MenuItemFormModalProps} props - The component props
 * @returns {JSX.Element} The menu item form modal component
 */
export function MenuItemFormModal({
  buttonText = "Add Menu Item",
}: MenuItemFormModalProps): JSX.Element {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[95vh] md:max-h-[90vh]">
        <DialogHeader>
          <DialogTitle> Add New Menu Item</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new menu item for your
            restaurant.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] md:max-h-[70vh] pr-4">
          <div className="pb-6 px-2">
            <MenuItemForm setOpen={setOpen} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
