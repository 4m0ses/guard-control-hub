
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

interface DeleteAllCompaniesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companiesCount: number;
  onSuccess: () => void;
}

export function DeleteAllCompaniesDialog({
  isOpen,
  onClose,
  companiesCount,
  onSuccess,
}: DeleteAllCompaniesDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAll = async () => {
    console.log("Attempting to delete all companies");
    
    setIsDeleting(true);
    
    try {
      // Using the delete() without any filter will delete all records
      const { error } = await supabase
        .from('companies')
        .delete()
        .is('id', null) // This is a workaround to trigger deletion of all rows (true = all rows)
        .not('id', null); // This ensures we match all rows with non-null IDs
      
      if (error) {
        console.error("Error deleting companies:", error);
        toast.error(`Failed to delete companies: ${error.message}`);
      } else {
        console.log("All companies deleted successfully");
        toast.success("All companies deleted successfully");
        
        // First close the dialog
        onClose();
        
        // Then trigger data refetch in the parent component
        await onSuccess();
      }
    } catch (error: any) {
      console.error("Exception deleting companies:", error);
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
          <AlertDialogTitle>Delete All Companies</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you absolutely sure you want to delete <strong>all {companiesCount} companies</strong>?
            </p>
            <p className="font-semibold text-destructive">
              This action cannot be undone. All company data will be permanently deleted.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleDeleteAll();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete All"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
