
import { supabase } from "@/integrations/supabase/client";
import { CheckIn, CheckInsResponse, CheckInFilters } from "@/types/checkIn";

export const checkInService = {
  async getCheckIns(filters: CheckInFilters): Promise<CheckInsResponse> {
    try {
      // Default to 10 items per page
      const perPage = filters.perPage || 10;
      const page = filters.page || 1;
      
      // Start building the query
      let query = supabase
        .from('checkins_raw')
        .select('*', { count: 'exact' });
      
      // Apply filters if they exist
      if (filters.status) {
        query = query.eq('call_status', filters.status);
      }
      
      if (filters.search) {
        query = query.or(`call_id.ilike.%${filters.search}%,transcript.ilike.%${filters.search}%`);
      }
      
      if (filters.fromDate) {
        const fromTimestamp = new Date(filters.fromDate).getTime() / 1000;
        query = query.gte('start_timestamp', fromTimestamp);
      }
      
      if (filters.toDate) {
        const toTimestamp = new Date(filters.toDate).getTime() / 1000;
        query = query.lte('start_timestamp', toTimestamp);
      }
      
      // Add pagination
      query = query
        .range((page - 1) * perPage, page * perPage - 1)
        .order('start_timestamp', { ascending: false });
      
      // Execute the query
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return {
        data: data as CheckIn[],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching check-ins:', error);
      return { data: [], total: 0 };
    }
  },
  
  async getCheckInById(id: string): Promise<CheckIn | null> {
    try {
      const { data, error } = await supabase
        .from('checkins_raw')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as CheckIn;
    } catch (error) {
      console.error('Error fetching check-in by ID:', error);
      return null;
    }
  },
  
  async exportCheckIns(filters: CheckInFilters): Promise<boolean> {
    try {
      // In a real app, this would call an API endpoint that generates and returns a CSV file
      // For this example, we'll just return true to simulate a successful export
      
      // Imagine here we'd call something like:
      // const response = await fetch(`/api/checkins/export?${new URLSearchParams(filters)}`);
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'checkins-export.csv';
      // document.body.appendChild(a);
      // a.click();
      // a.remove();
      
      console.log('Exporting check-ins with filters:', filters);
      return true;
    } catch (error) {
      console.error('Error exporting check-ins:', error);
      return false;
    }
  }
};
