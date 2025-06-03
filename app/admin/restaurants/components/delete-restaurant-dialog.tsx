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

interface DeleteRestaurantDialogProps {
  restaurantId: string;
  restaurantName: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onDeleteSuccess?: () => void;
}

/**
 * Delete Restaurant Dialog Component
 *
 * A confirmation dialog that appears when a user attempts to delete a restaurant
 *
 * @param {DeleteRestaurantDialogProps} props - The component props
 * @returns {JSX.Element} The delete restaurant dialog component
 */
export function DeleteRestaurantDialog({
  restaurantId,
  restaurantName,
  isOpen,
  setIsOpen,
  onDeleteSuccess,
}: DeleteRestaurantDialogProps): JSX.Element {
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  // Use the TRPC mutation for deleting restaurants
  const deleteRestaurantMutation = trpc.restaurant.deleteRestaurant.useMutation({
    onSuccess: (data) => {
      setIsDeleting(false);
      setIsOpen(false);
      
      toastNotification.success(
        "Restaurant deleted",
        `${restaurantName} has been ${data.data ? "deactivated" : "permanently deleted"}.`
      );
      
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    },
    onError: (error) => {
      setIsDeleting(false);
      toastNotification.error(
        "Error deleting restaurant",
        error.message || "Failed to delete restaurant. Please try again."
      );
    }
  });
  
  // Handle the delete restaurant action
  const handleDeleteRestaurant = () => {
    setIsDeleting(true);
    deleteRestaurantMutation.mutate({ id: restaurantId });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-destructive">Delete Restaurant</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <span className="font-semibold">{restaurantName}</span>? This action cannot be undone.
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
            onClick={handleDeleteRestaurant}
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
