
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Database } from "@/integrations/supabase/types"
import { CompanyInfoFields } from "./CompanyInfoFields"
import { ContactInfoFields } from "./ContactInfoFields"
import { companyFormSchema, type CompanyFormValues } from "@/lib/schemas/companySchema"

type CompanyInsert = Database['public']['Tables']['companies']['Insert']

interface CreateCompanyFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCompanyForm({ isOpen, onClose }: CreateCompanyFormProps) {
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
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
  })

  async function onSubmit(data: CompanyFormValues) {
    try {
      setIsSubmitting(true)
      const { error } = await supabase
        .from('companies')
        .insert(data as CompanyInsert)

      if (error) throw error

      toast.success("Company created successfully")
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      form.reset()
      onClose()
    } catch (error) {
      console.error('Error creating company:', error)
      toast.error("Failed to create company")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Company</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CompanyInfoFields form={form} />
            <ContactInfoFields form={form} />

            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                type="button" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Company"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
