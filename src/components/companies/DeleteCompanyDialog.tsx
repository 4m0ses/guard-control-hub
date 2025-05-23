
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DeleteCompanyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  companyName: string;
  onSuccess: () => void;
}

export function DeleteCompanyDialog({
  isOpen,
  onClose,
  companyId,
  companyName,
  onSuccess,
}: DeleteCompanyDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    console.log("Attempting to delete company with ID:", companyId);
    
    if (!companyId) {
      toast.error("Missing company ID");
      onClose();
      return;
    }
    
    setIsDeleting(true);
    
    try {
      // Delete the company from the database
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId);
      
      if (error) {
        console.error("Error deleting company:", error);
        toast.error(`Failed to delete company: ${error.message}`);
      } else {
        console.log("Company deleted successfully");
        toast.success(`Company "${companyName}" deleted successfully`);
        
        // First close the dialog
        onClose();
        
        // Then trigger data refetch in the parent component
        // Make sure we wait for this to complete
        await onSuccess();
      }
    } catch (error: any) {
      console.error("Exception deleting company:", error);
      toast.error(`An unexpected error occurred: ${error.message}`);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the company <strong>{companyName}</strong> and all of its data.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
