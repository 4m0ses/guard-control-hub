
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { CompanyFormValues, companyFormSchema } from "@/lib/schemas/companySchema";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CompanyInfoFields } from "@/components/companies/CompanyInfoFields";
import { ContactInfoFields } from "@/components/companies/ContactInfoFields";

interface CreateCompanyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateCompanyForm({ isOpen, onClose, onSuccess }: CreateCompanyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: "",
      address: "",
      company_number: "",
      contact_first_name: "",
      contact_last_name: "",
      contact_position: "",
      contact_phone: "",
      contact_email: "",
    },
  });

  const onSubmit = async (data: CompanyFormValues) => {
    setIsSubmitting(true);
    console.log("Starting company creation with data:", data);

    try {
      console.log("Attempting to insert company with data:", data);
      // Cast the data to ensure all required fields are present
      const companyData = {
        name: data.name,
        address: data.address,
        company_number: data.company_number,
        contact_first_name: data.contact_first_name,
        contact_last_name: data.contact_last_name,
        contact_position: data.contact_position,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email,
      };
      
      const { data: createdCompany, error } = await supabase
        .from('companies')
        .insert(companyData)
        .select();

      if (error) {
        console.error("Error creating company:", error);
        toast.error(`Failed to add company: ${error.message}`);
      } else {
        console.log("Successfully created company:", createdCompany);
        toast.success("Company created successfully");
        form.reset();
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Exception in company creation:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Company Information</h3>
              <div className="grid gap-4 grid-cols-1">
                <CompanyInfoFields form={form} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <ContactInfoFields form={form} />
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-secureGuard-blue hover:bg-secureGuard-navy"
              >
                {isSubmitting ? "Creating..." : "Create Company"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
