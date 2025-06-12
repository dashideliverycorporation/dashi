"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { DeleteMenuItemDialog } from "./delete-menu-item-dialog";
import { JSX } from "react/jsx-runtime";

interface DeleteMenuItemButtonProps {
  menuItemId: string;
  menuItemName: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  onDeleteSuccess?: () => void;
  className?: string;
}

/**
 * Delete Menu Item Button Component
 *
 * Button that triggers a confirmation dialog for deleting a menu item
 *
 * @param {DeleteMenuItemButtonProps} props - The component props
 * @returns {JSX.Element} The delete menu item button component
 */
export function DeleteMenuItemButton({
  menuItemId,
  menuItemName,
  variant = "ghost",
  size = "icon",
  onDeleteSuccess,
  className = "",
}: DeleteMenuItemButtonProps): JSX.Element {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsDialogOpen(true)}
        className={`text-destructive hover:text-destructive hover:bg-destructive/10 ${className}`}
        aria-label={`Delete ${menuItemName}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <DeleteMenuItemDialog
        menuItemId={menuItemId}
        menuItemName={menuItemName}
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onDeleteSuccess={onDeleteSuccess}
      />
    </>
  );
}

export default DeleteMenuItemButton;