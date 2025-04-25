
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CompanyCard } from "./CompanyCard";

interface CompanyListProps {
  companies: any[];
  isLoading: boolean;
  error: any;
  onEdit: (company: any) => void;
  onDelete: (company: any) => void;
  onRetry: () => void;
}

export function CompanyList({ 
  companies, 
  isLoading, 
  error, 
  onEdit, 
  onDelete, 
  onRetry 
}: CompanyListProps) {
  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-500">Error loading companies. Please try again.</p>
          <Button 
            onClick={onRetry} 
            variant="outline" 
            className="mt-2"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center">Loading companies...</p>
        </CardContent>
      </Card>
    );
  }

  if (companies.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No companies found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          onEdit={() => {
            console.log("Edit company with ID:", company.id);
            onEdit(company);
          }}
          onDelete={() => {
            console.log("Delete company with ID:", company.id);
            onDelete(company);
          }}
        />
      ))}
    </div>
  );
}
