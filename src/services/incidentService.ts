
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export type Severity = 'low' | 'medium' | 'high';
export type IncidentStatus = 'open' | 'resolved';

export interface CreateIncidentDTO {
  siteId: string;
  title: string;
  locationDesc: string;
  severity: Severity;
  description: string;
  attachments?: string[];
}

export interface IncidentVersion {
  id: string;
  incident_id: string;
  created_by_user_id: string;
  created_at: string;
  description: string;
  attachment_urls: string[] | null;
  status: string;
}

export interface Incident {
  id: string;
  reported_by_user_id: string;
  site_id: string;
  created_at: string;
  updated_at: string;
  severity: Severity;
  location: string;
  status: IncidentStatus;
  current_version_id: string | null;
  title: string;
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
          reported_by_user_id: (await supabase.auth.getUser()).data.user?.id,
          severity: data.severity,
          location: data.locationDesc,
          title: data.title,
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
          attachment_urls: data.attachments,
          created_by_user_id: (await supabase.auth.getUser()).data.user?.id,
          status: 'open',
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
          currentVersion:incident_versions!incident_reports_current_version_fkey(*)
        `)
        .single();

      if (updateError) throw updateError;

      return updatedIncident as unknown as Incident;
    } catch (error) {
      console.error('Error creating incident:', error);
      return null;
    }
  },

  async updateIncident(
    incidentId: string,
    description: string,
    status: IncidentStatus,
    attachments?: string[]
  ): Promise<boolean> {
    try {
      // Create new version
      const { data: version, error: versionError } = await supabase
        .from('incident_versions')
        .insert({
          incident_id: incidentId,
          description,
          attachment_urls: attachments,
          created_by_user_id: (await supabase.auth.getUser()).data.user?.id,
          status,
        })
        .select()
        .single();

      if (versionError) throw versionError;

      // Update current version reference and status
      const { error: updateError } = await supabase
        .from('incident_reports')
        .update({
          current_version_id: version.id,
        })
        .eq('id', incidentId);

      if (updateError) throw updateError;

      return true;
    } catch (error) {
      console.error('Error updating incident:', error);
      return false;
    }
  },

  async getIncident(id: string): Promise<Incident | null> {
    try {
      const { data, error } = await supabase
        .from('incident_reports')
        .select(`
          *,
          currentVersion:incident_versions!incident_reports_current_version_fkey(*),
          versions:incident_versions(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as unknown as Incident;
    } catch (error) {
      console.error('Error fetching incident:', error);
      return null;
    }
  },

  async getIncidents(): Promise<Incident[]> {
    try {
      const { data, error } = await supabase
        .from('incident_reports')
        .select(`
          *,
          currentVersion:incident_versions!incident_reports_current_version_fkey(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as Incident[];
    } catch (error) {
      console.error('Error fetching incidents:', error);
      return [];
    }
  }
};
