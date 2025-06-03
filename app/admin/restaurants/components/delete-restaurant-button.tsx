"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RestaurantWithUsers } from "@/types/restaurant";
import { JSX } from "react/jsx-runtime";
import { DeleteRestaurantDialog } from "./delete-restaurant-dialog";

interface DeleteRestaurantButtonProps {
  restaurant: RestaurantWithUsers;
  onDeleteSuccess?: () => void;
}

/**
 * Delete Restaurant Button Component
 *
 * A button that opens the delete restaurant confirmation dialog
 *
 * @param {DeleteRestaurantButtonProps} props - The component props
 * @returns {JSX.Element} The delete restaurant button component
 */
export function DeleteRestaurantButton({
  restaurant,
  onDeleteSuccess,
}: DeleteRestaurantButtonProps): JSX.Element {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        className="p-0 hover:bg-transparent text-destructive hover:text-destructive/90"
        onClick={() => setIsDeleteDialogOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
      
      <DeleteRestaurantDialog
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onDeleteSuccess={onDeleteSuccess}
      />
    </>
  );
}
