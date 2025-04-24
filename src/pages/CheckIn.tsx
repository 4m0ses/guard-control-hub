
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FilterBar from "@/components/checkins/FilterBar";
import CheckInsTable from "@/components/checkins/CheckInsTable";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { checkInService } from "@/services/checkInService";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";

const CheckIn = () => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "all",
    siteId: "all",
    fromDate: "",
    toDate: "",
    search: "",
  });

  const { data: checkinData, isLoading, error, refetch } = useQuery({
    queryKey: ['checkins', currentPage, filters],
    queryFn: () => checkInService.getCheckIns({ page: currentPage, ...filters }),
  });

  const handleFilterChange = (newFilters: any) => {
    console.log("Filter changed:", newFilters);
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

  // For development testing, add a way to force sample data
  const handleDebugSample = () => {
    setFilters(prev => ({ ...prev, debug: 'sample' }));
    setTimeout(() => refetch(), 100);
  };

  const totalPages = checkinData?.total ? Math.ceil(checkinData.total / 10) : 0; // Assuming 10 items per page

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Check-In Logs</h1>
          
          {process.env.NODE_ENV === 'development' && (
            <button onClick={handleDebugSample} className="text-xs text-gray-400 hover:text-gray-600">
              Load Test Data
            </button>
          )}
        </div>
        
        <FilterBar onFilterChange={handleFilterChange} onExport={handleExport} />
        
        {isLoading ? (
          <Card className="p-6 text-center">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading check-in logs...</p>
          </Card>
        ) : error ? (
          <Card className="p-6 text-center text-red-600">
            <AlertCircle className="h-10 w-10 mx-auto mb-2" />
            <p>An error occurred while loading check-in data.</p>
            <button 
              onClick={() => refetch()} 
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Try Again
            </button>
          </Card>
        ) : checkinData?.data.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground mb-2">No check-in logs found matching your criteria.</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters or clearing the search.</p>
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
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
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
