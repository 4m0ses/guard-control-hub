
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2, MapPin } from "lucide-react";

// Mock data
const initialSites = [
  { 
    id: "site1", 
    name: "Downtown Office Complex", 
    address: "123 Business Ave, Cityville, CA 92101", 
    company: "Sentinel Security Services",
    guardCount: 8,
    status: "active"
  },
  { 
    id: "site2", 
    name: "Westside Mall", 
    address: "789 Shopping Center Rd, Cityville, CA 92102", 
    company: "Guardian Protection Inc.",
    guardCount: 12,
    status: "active"
  },
  { 
    id: "site3", 
    name: "Riverside Apartments", 
    address: "456 River Lane, Cityville, CA 92103", 
    company: "Aegis Security Solutions",
    guardCount: 4,
    status: "active"
  },
  { 
    id: "site4", 
    name: "Tech Park Campus", 
    address: "101 Innovation Dr, Cityville, CA 92104", 
    company: "Sentinel Security Services",
    guardCount: 6,
    status: "inactive"
  },
];

const Sites = () => {
  const [sites, setSites] = useState(initialSites);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    site.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Sites</h1>
          <Button className="bg-secureGuard-blue hover:bg-secureGuard-navy">
            <Plus className="mr-2 h-4 w-4" /> New Site
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search sites..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid gap-4">
          {filteredSites.length > 0 ? (
            filteredSites.map((site) => (
              <Card key={site.id} className="overflow-hidden">
                <CardHeader className="bg-muted p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CardTitle>{site.name}</CardTitle>
                      <span className={`ml-4 px-2 py-1 text-xs font-medium rounded-full ${
                        site.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {site.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
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
                      <div className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1 text-secureGuard-blue" />
                        <p>{site.address}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Company</p>
                      <p className="mt-1">{site.company}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Assigned Guards</p>
                      <p className="mt-1">{site.guardCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No sites found. Try adjusting your search.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Sites;
