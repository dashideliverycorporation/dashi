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
  
  // Use the TRPC mutation for deleting menu items
  const deleteMenuItemMutation = trpc.restaurant.deleteMenuItem.useMutation({
    onSuccess: () => {
      setIsDeleting(false);
      setIsOpen(false);
      
      toastNotification.success(
        "Menu item deleted",
        `${menuItemName} has been removed from your menu.`
      );
      
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    },
    onError: (error) => {
      setIsDeleting(false);
      toastNotification.error(
        "Error deleting menu item",
        error.message || "Failed to delete menu item. Please try again."
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
          <DialogTitle className="text-destructive">Delete Menu Item</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <span className="font-semibold">{menuItemName}</span>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleDeleteMenuItem}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
