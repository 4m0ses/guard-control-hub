
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, AlertTriangle } from "lucide-react";
import { formatDistance } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { incidentService, type Incident } from "@/services/incidentService";

const severityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
};

const statusColors = {
  open: "bg-gray-100 text-gray-800",
  resolved: "bg-green-100 text-green-800",
};

const Incidents = () => {
  const navigate = useNavigate();
  const { data: incidents, isLoading } = useQuery({
    queryKey: ['incidents'],
    queryFn: incidentService.getIncidents
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Incidents</h1>
          <Button onClick={() => navigate("/incidents/new")}>
            <Plus className="mr-2 h-4 w-4" /> New Incident
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading incidents...</div>
        ) : incidents?.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No incidents reported yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {incidents?.map((incident) => (
              <Card 
                key={incident.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/incidents/${incident.id}`)}
              >
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className={`h-5 w-5 ${
                          incident.severity === 'high' ? 'text-red-500' : 'text-yellow-500'
                        }`} />
                        {incident.title}
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {incident.location}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        severityColors[incident.severity]
                      }`}>
                        {incident.severity}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[incident.currentVersion?.status as keyof typeof statusColors || 'open']
                      }`}>
                        {incident.currentVersion?.status || 'open'}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-sm text-muted-foreground">
                    Reported {formatDistance(new Date(incident.created_at), new Date(), { addSuffix: true })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Incidents;
