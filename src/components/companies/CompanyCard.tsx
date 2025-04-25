
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface CompanyCardProps {
  company: {
    id: string;
    name: string;
    address: string;
    contact_first_name: string;
    contact_last_name: string;
    contact_position: string;
    contact_phone: string;
    contact_email: string;
  };
  onEdit: (company: any) => void;
  onDelete: (company: any) => void;
}

export function CompanyCard({ company, onEdit, onDelete }: CompanyCardProps) {
  const handleEdit = () => {
    console.log("Edit button clicked for company:", company.id);
    onEdit(company);
  };
  
  const handleDelete = () => {
    console.log("Delete button clicked for company:", company.id);
    onDelete(company);
  };

  return (
    <Card key={company.id} className="overflow-hidden">
      <CardHeader className="bg-muted p-4">
        <div className="flex justify-between items-center">
          <CardTitle>{company.name}</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleEdit}
              title="Edit company"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleDelete}
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
  );
}
