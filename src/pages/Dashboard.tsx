
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, MapPin, Users, Clock, AlertTriangle } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data
  const stats = {
    totalSites: 24,
    activeGuards: 45,
    pendingCheckins: 3,
    recentIncidents: 1,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Sites Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
              <Shield className="h-4 w-4 text-secureGuard-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSites}</div>
              <p className="text-xs text-muted-foreground">Secured locations</p>
            </CardContent>
          </Card>
          
          {/* Active Guards Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Active Guards</CardTitle>
              <Users className="h-4 w-4 text-secureGuard-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeGuards}</div>
              <p className="text-xs text-muted-foreground">Currently on duty</p>
            </CardContent>
          </Card>
          
          {/* Pending Check-ins Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Pending Check-ins</CardTitle>
              <Clock className="h-4 w-4 text-secureGuard-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingCheckins}</div>
              <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            </CardContent>
          </Card>
          
          {/* Recent Incidents Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Recent Incidents</CardTitle>
              <AlertTriangle className="h-4 w-4 text-secureGuard-red" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentIncidents}</div>
              <p className="text-xs text-muted-foreground">In the last 24 hours</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest check-ins and incidents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="rounded-full w-2 h-2 bg-green-500 mr-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Guard #1138 checked in at Downtown Office</p>
                  <p className="text-xs text-muted-foreground">Today, 09:45 AM</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="rounded-full w-2 h-2 bg-green-500 mr-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Guard #2245 checked in at Westside Mall</p>
                  <p className="text-xs text-muted-foreground">Today, 09:30 AM</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="rounded-full w-2 h-2 bg-secureGuard-red mr-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Incident reported at Riverside Apartments</p>
                  <p className="text-xs text-muted-foreground">Today, 08:15 AM</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="rounded-full w-2 h-2 bg-green-500 mr-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Guard #1524 checked in at Corporate HQ</p>
                  <p className="text-xs text-muted-foreground">Today, 08:00 AM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
