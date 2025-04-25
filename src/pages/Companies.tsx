
import { useState } from "react";
import { useQuery, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { CreateCompanyForm } from "@/components/companies/CreateCompanyForm";
import { EditCompanyForm } from "@/components/companies/EditCompanyForm";
import { DeleteCompanyDialog } from "@/components/companies/DeleteCompanyDialog";
import { CompanySearch } from "@/components/companies/CompanySearch";
import { CompanyList } from "@/components/companies/CompanyList";

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const { data: companies = [], isLoading, error, refetch } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      console.log("Fetching companies...")
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name')
      
      if (error) {
        console.error('Error fetching companies:', error)
        toast.error(`Error loading companies: ${error.message}`)
        throw error
      }
      
      console.log("Successfully fetched companies:", data)
      return data || []
    },
  });

  const handleEditClick = (company) => {
    console.log("Edit clicked for company:", company);
    setSelectedCompany(company);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (company) => {
    console.log("Delete clicked for company:", company);
    setSelectedCompany(company);
    setIsDeleteDialogOpen(true);
  };

  const handleOperationSuccess = async () => {
    console.log("Operation successful, refetching companies...");
    await refetch();
  };

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    `${company.contact_first_name} ${company.contact_last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.company_number && company.company_number.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Companies</h1>
          <Button 
            className="bg-secureGuard-blue hover:bg-secureGuard-navy"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> New Company
          </Button>
        </div>
        
        <CompanySearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <CompanyList
          companies={filteredCompanies}
          isLoading={isLoading}
          error={error}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onRetry={() => refetch()}
        />

        <CreateCompanyForm 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleOperationSuccess}
        />

        {selectedCompany && (
          <>
            <EditCompanyForm
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              company={selectedCompany}
              onSuccess={handleOperationSuccess}
            />

            <DeleteCompanyDialog
              isOpen={isDeleteDialogOpen}
              onClose={() => setIsDeleteDialogOpen(false)}
              companyId={selectedCompany.id}
              companyName={selectedCompany.name}
              onSuccess={handleOperationSuccess}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Companies;
