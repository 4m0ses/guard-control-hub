
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CreateCompanyForm } from "@/components/companies/CreateCompanyForm";
import { EditCompanyForm } from "@/components/companies/EditCompanyForm";
import { DeleteCompanyDialog } from "@/components/companies/DeleteCompanyDialog";
import { toast } from "sonner";

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
      
      if (error) {
        console.error('Error fetching companies:', error)
        toast.error(`Error loading companies: ${error.message}`)
        throw error
      }
      
      console.log("Successfully fetched companies:", data)
      return data || []
    },
  })

  // Force refetch when component mounts
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleEditClick = (company) => {
    setSelectedCompany(company);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (company) => {
    setSelectedCompany(company);
    setIsDeleteDialogOpen(true);
  };

  const handleOperationSuccess = () => {
    // Force a refetch to get the updated data
    refetch();
  };

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    `${company.contact_first_name} ${company.contact_last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.company_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    console.error("Query error:", error)
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Companies</h1>
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <p className="text-red-500">Failed to load companies</p>
                <Button onClick={() => refetch()}>Try Again</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

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
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search companies..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-500">Error loading companies. Please try again.</p>
              <Button 
                onClick={() => refetch()} 
                variant="outline" 
                className="mt-2"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center">Loading companies...</p>
              </CardContent>
            </Card>
          ) : filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <Card key={company.id} className="overflow-hidden">
                <CardHeader className="bg-muted p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle>{company.name}</CardTitle>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditClick(company)}
                        title="Edit company"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteClick(company)}
                        title="Delete company"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Address</p>
                      <p>{company.address}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Contact Person</p>
                      <p>{`${company.contact_first_name} ${company.contact_last_name}`}</p>
                      <p className="text-sm text-muted-foreground">{company.contact_position}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Contact Info</p>
                      <p>{company.contact_phone}</p>
                      <p className="text-sm text-muted-foreground">{company.contact_email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  {searchTerm ? "No companies found matching your search." : "No companies added yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Modals */}
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
