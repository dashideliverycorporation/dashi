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
import { MenuItemForm } from "@/app/restaurant/menu/components/menu-item-form";
import { JSX } from "react/jsx-runtime";
import type { MenuItemWithCategory } from "@/types/menu";
import { useTranslation } from "@/hooks/useTranslation";

interface MenuItemFormModalProps {
  buttonText?: string;
  menuItem?: MenuItemWithCategory;
  restaurantId: string;
  isEdit?: boolean;
  onMenuItemChange?: () => void;
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
  menuItem,
  restaurantId,
  isEdit = false,
  onMenuItemChange,
}: MenuItemFormModalProps): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();

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
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="self-start">
            {isEdit ? t("restaurantMenu.form.editTitle") : t("restaurantMenu.form.createTitle")}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] md:max-h-[70vh] pr-4">
          <div className="lg:pb-6 lg:px-2 p-0">
            <MenuItemForm 
              setOpen={setOpen} 
              menuItem={menuItem}
              restaurantId={restaurantId}
              onSuccess={() => {
                // Call the callback function when menu item is successfully created/updated
                if (onMenuItemChange) {
                  onMenuItemChange();
                }
              }}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
