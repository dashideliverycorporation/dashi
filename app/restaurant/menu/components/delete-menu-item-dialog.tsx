"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc/client";
import { toastNotification } from "@/components/custom/toast-notification";
import { Loader2 } from "lucide-react";
import { JSX } from "react/jsx-runtime";
import { useTranslation } from "@/hooks/useTranslation";

interface DeleteMenuItemDialogProps {
  menuItemId: string;
  menuItemName: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onDeleteSuccess?: () => void;
}

/**
 * Delete Menu Item Dialog Component
 *
 * A confirmation dialog that appears when a user attempts to delete a menu item
 *
 * @param {DeleteMenuItemDialogProps} props - The component props
 * @returns {JSX.Element} The delete menu item dialog component
 */
export function DeleteMenuItemDialog({
  menuItemId,
  menuItemName,
  isOpen,
  setIsOpen,
  onDeleteSuccess,
}: DeleteMenuItemDialogProps): JSX.Element {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { t, i18n } = useTranslation();

  // Ensure translations are ready to avoid hydration mismatch
  const isTranslationReady = i18n.isInitialized && i18n.hasLoadedNamespace('common');

  // Helper function to get translated text with fallback
  const getTranslation = (key: string, fallback: string): string => {
    if (!isTranslationReady) {
      return fallback;
    }
    const translated = t(key);
    // If translation returns the key itself, use fallback
    return translated === key ? fallback : translated;
  };
  
  // Use the TRPC mutation for deleting menu items
  const deleteMenuItemMutation = trpc.restaurant.deleteMenuItem.useMutation({
    onSuccess: () => {
      setIsDeleting(false);
      setIsOpen(false);
      
      toastNotification.success(
        getTranslation("restaurantMenu.delete.success.title", "Menu item deleted"),
        `${menuItemName} ${getTranslation("restaurantMenu.delete.success.message", "has been removed from your menu.")}`
      );
      
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    },
    onError: (error) => {
      setIsDeleting(false);
      toastNotification.error(
        getTranslation("restaurantMenu.delete.error.title", "Error deleting menu item"),
        error.message || getTranslation("restaurantMenu.delete.error.message", "Failed to delete menu item. Please try again.")
      );
    }
  });
  
  // Handle the delete menu item action
  const handleDeleteMenuItem = () => {
    setIsDeleting(true);
    deleteMenuItemMutation.mutate({ id: menuItemId });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive">{getTranslation("restaurantMenu.delete.title", "Delete Menu Item")}</DialogTitle>
          <DialogDescription>
            {getTranslation("restaurantMenu.delete.description", "Are you sure you want to delete")} <span className="font-semibold">{menuItemName}</span>{getTranslation("restaurantMenu.delete.cannotUndo", "? This action cannot be undone.")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            {getTranslation("restaurantMenu.delete.cancel", "Cancel")}
          </Button>
          <Button 
            variant="destructive"
            onClick={handleDeleteMenuItem}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {getTranslation("restaurantMenu.delete.deleting", "Deleting...")}
              </>
            ) : (
              getTranslation("restaurantMenu.delete.delete", "Delete")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
