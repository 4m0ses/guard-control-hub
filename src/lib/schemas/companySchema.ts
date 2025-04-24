
import * as z from "zod"

export const companyFormSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  company_number: z.string().min(2, "Company number must be at least 2 characters"),
  contact_first_name: z.string().min(2, "First name must be at least 2 characters"),
  contact_last_name: z.string().min(2, "Last name must be at least 2 characters"),
  contact_position: z.string().min(2, "Position must be at least 2 characters"),
  contact_phone: z.string().min(5, "Phone must be at least 5 characters"),
  contact_email: z.string().email("Invalid email address"),
})

export type CompanyFormValues = z.infer<typeof companyFormSchema>

