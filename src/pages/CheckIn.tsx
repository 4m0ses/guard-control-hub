
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FilterBar from "@/components/checkins/FilterBar";
import CheckInsTable from "@/components/checkins/CheckInsTable";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { checkInService } from "@/services/checkInService";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const CheckIn = () => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    siteId: "",
    fromDate: "",
    toDate: "",
    search: "",
  });

  const { data: checkinData, isLoading, error } = useQuery({
    queryKey: ['checkins', currentPage, filters],
    queryFn: () => checkInService.getCheckIns({ page: currentPage, ...filters }),
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleExport = () => {
    checkInService.exportCheckIns(filters)
      .then(() => {
        toast({
          title: "Export successful",
          description: "Your check-in data has been exported to CSV.",
        });
      })
      .catch(() => {
        toast({
          title: "Export failed",
          description: "There was an error exporting your data. Please try again.",
          variant: "destructive",
        });
      });
  };

  const totalPages = checkinData?.total ? Math.ceil(checkinData.total / 10) : 0; // Assuming 10 items per page

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Check-In Logs</h1>
        
        <FilterBar onFilterChange={handleFilterChange} onExport={handleExport} />
        
        {isLoading ? (
          <div className="text-center py-4">Loading check-in logs...</div>
        ) : error ? (
          <Card className="p-6 text-center text-red-600">
            An error occurred while loading check-in data. Please try again.
          </Card>
        ) : checkinData?.data.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No check-in logs found matching your criteria.</p>
          </Card>
        ) : (
          <CheckInsTable checkins={checkinData?.data || []} />
        )}
        
        {totalPages > 0 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                  disabled={currentPage === 1} 
                />
              </PaginationItem>
              
              {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                let pageNum = idx + 1;
                if (totalPages > 5) {
                  if (currentPage > 3 && currentPage < totalPages - 1) {
                    pageNum = currentPage - 2 + idx;
                  } else if (currentPage >= totalPages - 1) {
                    pageNum = totalPages - 4 + idx;
                  }
                }
                
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink 
                      isActive={pageNum === currentPage}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                  disabled={currentPage === totalPages} 
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CheckIn;
