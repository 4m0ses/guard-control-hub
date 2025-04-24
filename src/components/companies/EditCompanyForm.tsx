
import { useState, useEffect } from "react";
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

interface EditCompanyFormProps {
  isOpen: boolean;
  onClose: () => void;
  company: any;
  onSuccess: () => void;
}

export function EditCompanyForm({ isOpen, onClose, company, onSuccess }: EditCompanyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: company?.name || "",
      address: company?.address || "",
      company_number: company?.company_number || "",
      contact_first_name: company?.contact_first_name || "",
      contact_last_name: company?.contact_last_name || "",
      contact_position: company?.contact_position || "",
      contact_phone: company?.contact_phone || "",
      contact_email: company?.contact_email || "",
    },
  });

  // Update form values when company data changes
  useEffect(() => {
    if (company) {
      form.reset({
        name: company.name || "",
        address: company.address || "",
        company_number: company.company_number || "",
        contact_first_name: company.contact_first_name || "",
        contact_last_name: company.contact_last_name || "",
        contact_position: company.contact_position || "",
        contact_phone: company.contact_phone || "",
        contact_email: company.contact_email || "",
      });
    }
  }, [company, form]);

  const onSubmit = async (data: CompanyFormValues) => {
    if (!company?.id) {
      toast.error("Missing company ID");
      return;
    }

    setIsSubmitting(true);
    console.log(`Updating company ${company.id} with data:`, data);

    try {
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
      
      const { error } = await supabase
        .from('companies')
        .update(companyData)
        .eq('id', company.id);

      if (error) {
        console.error("Error updating company:", error);
        toast.error(`Failed to update company: ${error.message}`);
      } else {
        toast.success("Company updated successfully");
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Exception updating company:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
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
                {isSubmitting ? "Updating..." : "Update Company"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
