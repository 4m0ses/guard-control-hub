
import { supabase } from "@/integrations/supabase/client";

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
  incident_report_id: string;
  edited_by_id: string;
  edited_at: string;
  description: string;
  attachments: string[] | null;
  created_at: string;
}

export interface Incident {
  id: string;
  guard_id: string;
  site_id: string;
  submitted_at: string;
  severity: Severity;
  location_desc: string;
  status: IncidentStatus;
  current_version: string | null;
  raw_payload: any | null;
  created_at: string;
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
          guard_id: (await supabase.auth.getUser()).data.user?.id,
          severity: data.severity,
          location_desc: data.locationDesc,
          status: 'open' as IncidentStatus,
        })
        .select()
        .single();

      if (incidentError) throw incidentError;

      // Then create the initial version
      const { data: version, error: versionError } = await supabase
        .from('incident_versions')
        .insert({
          incident_report_id: incident.id,
          description: data.description,
          attachments: data.attachments,
          edited_by_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (versionError) throw versionError;

      // Update the incident with the current version
      const { data: updatedIncident, error: updateError } = await supabase
        .from('incident_reports')
        .update({ current_version: version.id })
        .eq('id', incident.id)
        .select(`
          *,
          currentVersion:incident_versions!incident_reports_current_version_fkey(*)
        `)
        .single();

      if (updateError) throw updateError;

      return updatedIncident as Incident;
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
          incident_report_id: incidentId,
          description,
          attachments,
          edited_by_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (versionError) throw versionError;

      // Update current version reference and status
      const { error: updateError } = await supabase
        .from('incident_reports')
        .update({
          current_version: version.id,
          status
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
      return data as Incident;
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
      return data as Incident[];
    } catch (error) {
      console.error('Error fetching incidents:', error);
      return [];
    }
  }
};
