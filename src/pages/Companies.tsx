
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2 } from "lucide-react";

// Mock data
const initialCompanies = [
  { id: "company1", name: "Sentinel Security Services", address: "123 Main St, Anytown, CA", contactPerson: "John Doe", phone: "(555) 123-4567" },
  { id: "company2", name: "Guardian Protection Inc.", address: "456 Oak Ave, Somecity, CA", contactPerson: "Jane Smith", phone: "(555) 987-6543" },
  { id: "company3", name: "Aegis Security Solutions", address: "789 Pine Blvd, Othertown, CA", contactPerson: "Robert Johnson", phone: "(555) 567-8901" },
];

const Companies = () => {
  const [companies, setCompanies] = useState(initialCompanies);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    company.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Companies</h1>
          <Button className="bg-secureGuard-blue hover:bg-secureGuard-navy">
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

        <div className="grid gap-4">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <Card key={company.id} className="overflow-hidden">
                <CardHeader className="bg-muted p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle>{company.name}</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
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
                      <p>{company.contactPerson}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Phone</p>
                      <p>{company.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No companies found. Try adjusting your search.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Companies;
