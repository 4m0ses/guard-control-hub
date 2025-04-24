
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'reported' | 'investigating' | 'resolved' | 'closed';

export interface CreateIncidentDTO {
  siteId: string;
  title: string;
  location: string;
  severity: Severity;
  description: string;
  attachmentUrls?: string[];
}

export interface IncidentVersion {
  id: string;
  description: string;
  status: IncidentStatus;
  attachmentUrls: string[] | null;
  created_at: string;
  created_by_user_id: string;
}

export interface Incident {
  id: string;
  title: string;
  location: string;
  severity: Severity;
  site_id: string;
  reported_by_user_id: string;
  current_version_id: string;
  created_at: string;
  updated_at: string;
  currentVersion?: IncidentVersion;
  versions?: IncidentVersion[];
}

export const incidentService = {
  async createIncident(data: CreateIncidentDTO): Promise<Incident | null> {
    try {
      // First, create the incident report
      const { data: incident, error: incidentError } = await supabase
        .from('incident_reports')
        .insert({
          site_id: data.siteId,
          title: data.title,
          location: data.location,
          severity: data.severity,
          reported_by_user_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (incidentError) throw incidentError;

      // Then create the initial version
      const { data: version, error: versionError } = await supabase
        .from('incident_versions')
        .insert({
          incident_id: incident.id,
          description: data.description,
          status: 'reported',
          attachment_urls: data.attachmentUrls,
          created_by_user_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (versionError) throw versionError;

      // Update the incident with the current version
      const { data: updatedIncident, error: updateError } = await supabase
        .from('incident_reports')
        .update({ current_version_id: version.id })
        .eq('id', incident.id)
        .select(`
          *,
          currentVersion:incident_versions!incident_reports_current_version_id_fkey(*)
        `)
        .single();

      if (updateError) throw updateError;

      return updatedIncident;
    } catch (error) {
      console.error('Error creating incident:', error);
      toast.error('Failed to create incident');
      return null;
    }
  },

  async updateIncident(
    incidentId: string, 
    description: string, 
    status: IncidentStatus,
    attachmentUrls?: string[]
  ): Promise<boolean> {
    try {
      // Create new version
      const { data: version, error: versionError } = await supabase
        .from('incident_versions')
        .insert({
          incident_id: incidentId,
          description,
          status,
          attachment_urls: attachmentUrls,
          created_by_user_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (versionError) throw versionError;

      // Update current version reference
      const { error: updateError } = await supabase
        .from('incident_reports')
        .update({ 
          current_version_id: version.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', incidentId);

      if (updateError) throw updateError;

      return true;
    } catch (error) {
      console.error('Error updating incident:', error);
      toast.error('Failed to update incident');
      return false;
    }
  },

  async getIncident(id: string): Promise<Incident | null> {
    try {
      const { data, error } = await supabase
        .from('incident_reports')
        .select(`
          *,
          currentVersion:incident_versions!incident_reports_current_version_id_fkey(*),
          versions:incident_versions(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching incident:', error);
      toast.error('Failed to fetch incident');
      return null;
    }
  },

  async getIncidents(): Promise<Incident[]> {
    try {
      const { data, error } = await supabase
        .from('incident_reports')
        .select(`
          *,
          currentVersion:incident_versions!incident_reports_current_version_id_fkey(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching incidents:', error);
      toast.error('Failed to fetch incidents');
      return [];
    }
  }
};
