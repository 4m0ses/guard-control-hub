
import { supabase } from "@/integrations/supabase/client";
import { CheckIn, CheckInsResponse, CheckInFilters } from "@/types/checkIn";

export const checkInService = {
  async getCheckIns(filters: CheckInFilters): Promise<CheckInsResponse> {
    try {
      const perPage = filters.perPage || 10;
      const page = filters.page || 1;
      
      let query = supabase
        .from('checkins_raw')
        .select('*', { count: 'exact' });
      
      if (filters.status) {
        query = query.eq('call_status', filters.status);
      }
      
      if (filters.search) {
        query = query.or(`call_id.ilike.%${filters.search}%,transcript.ilike.%${filters.search}%`);
      }
      
      if (filters.fromDate) {
        const fromTimestamp = Math.floor(new Date(filters.fromDate).getTime() / 1000);
        query = query.gte('start_timestamp', fromTimestamp);
      }
      
      if (filters.toDate) {
        const toTimestamp = Math.floor(new Date(filters.toDate).getTime() / 1000);
        query = query.lte('start_timestamp', toTimestamp);
      }
      
      query = query
        .range((page - 1) * perPage, page * perPage - 1)
        .order('start_timestamp', { ascending: false });
      
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
        .eq('id', parseInt(id, 10))
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
      console.log('Exporting check-ins with filters:', filters);
      return true;
    } catch (error) {
      console.error('Error exporting check-ins:', error);
      return false;
    }
  }
};
