
import * as z from "zod"

export const companyFormSchema = z.object({
  name: z.string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters"),
  address: z.string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must not exceed 200 characters"),
  company_number: z.string()
    .min(2, "Company number must be at least 2 characters")
    .max(50, "Company number must not exceed 50 characters"),
  contact_first_name: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),
  contact_last_name: z.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters"),
  contact_position: z.string()
    .min(2, "Position must be at least 2 characters")
    .max(100, "Position must not exceed 100 characters"),
  contact_phone: z.string()
    .min(5, "Phone must be at least 5 characters")
    .max(20, "Phone must not exceed 20 characters"),
  contact_email: z.string()
    .email("Invalid email address")
    .max(100, "Email must not exceed 100 characters"),
})

export type CompanyFormValues = z.infer<typeof companyFormSchema>
