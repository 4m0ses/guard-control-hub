
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Check, Loader2 } from "lucide-react";

const CheckIn = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);

  // Simulate check-in process
  const handleCheckIn = async () => {
    setIsLoading(true);

    try {
      // Simulate API call to n8n webhook
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const timestamp = new Date().toLocaleTimeString();
      setLastCheckIn(timestamp);

      toast({
        title: "Check-in recorded",
        description: `Your presence was recorded at ${timestamp}.`,
      });
    } catch (error) {
      toast({
        title: "Check-in failed",
        description: "There was an error recording your check-in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-center">Guard Check-in</h1>
        
        <Card className="border-2 border-secureGuard-blue">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Downtown Office Complex</CardTitle>
            <CardDescription>123 Business Ave, Cityville, CA 92101</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Current time:</p>
              <p className="text-xl font-semibold">
                {new Date().toLocaleTimeString()}
              </p>
            </div>
            
            {lastCheckIn && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Check className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-800">Successfully Checked In</span>
                </div>
                <p className="text-green-700">Last check-in recorded at {lastCheckIn}</p>
              </div>
            )}
            
            <Button 
              className="w-full bg-secureGuard-blue hover:bg-secureGuard-navy h-14 text-lg"
              onClick={handleCheckIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Recording...
                </>
              ) : (
                "Check In Now"
              )}
            </Button>
            
            <p className="text-sm text-center text-muted-foreground">
              By checking in, you confirm your presence at this location.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Check-in History</CardTitle>
          </CardHeader>
          <CardContent>
            {lastCheckIn ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">Today</p>
                    <p className="text-sm text-muted-foreground">Checked in at {lastCheckIn}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Recorded</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">Yesterday</p>
                    <p className="text-sm text-muted-foreground">Checked in at 9:03 AM</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Recorded</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">April 22, 2025</p>
                    <p className="text-sm text-muted-foreground">Checked in at 8:57 AM</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Recorded</span>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No check-ins recorded today
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CheckIn;
