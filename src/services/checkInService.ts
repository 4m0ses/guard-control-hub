
import { supabase } from "@/integrations/supabase/client";
import { CheckIn, CheckInsResponse, CheckInFilters } from "@/types/checkIn";

export const checkInService = {
  async getCheckIns(filters: CheckInFilters): Promise<CheckInsResponse> {
    try {
      console.log("Fetching check-ins with filters:", filters);
      const perPage = filters.perPage || 10;
      const page = filters.page || 1;
      
      let query = supabase
        .from('checkins_raw')
        .select('*', { count: 'exact' });
      
      if (filters.status && filters.status !== "all") {
        query = query.eq('call_status', filters.status);
      }
      
      if (filters.search) {
        query = query.or(`call_id.ilike.%${filters.search}%,transcript.ilike.%${filters.search}%`);
      }
      
      if (filters.fromDate) {
        const fromDate = new Date(filters.fromDate);
        const fromTimestamp = Math.floor(fromDate.getTime());
        query = query.gte('start_timestamp', fromTimestamp);
        console.log("From timestamp:", fromTimestamp, "From date:", filters.fromDate);
      }
      
      if (filters.toDate) {
        const toDate = new Date(filters.toDate);
        // Set to end of day
        toDate.setHours(23, 59, 59, 999);
        const toTimestamp = Math.floor(toDate.getTime());
        query = query.lte('start_timestamp', toTimestamp);
        console.log("To timestamp:", toTimestamp, "To date:", filters.toDate);
      }
      
      // For debugging, let's add a small sample data if the table is empty
      if (filters.debug === 'sample') {
        // This is just for development to test UI when database is empty
        const sampleData = [
          {
            id: 1,
            call_id: "call_8890e65de82ac10454d9975d0fe",
            event: "call_ended",
            call_type: "phone_call",
            agent_id: "agent_3f72c66e09948f7c8738b1b55a",
            call_status: "ended",
            start_timestamp: 1745529935961,
            end_timestamp: 1745530039691,
            duration_ms: 103730,
            transcript: "Agent: Hello Dee, this is your scheduled check-in call from Silver Watch Security\nAgent: How are you doing so far during your shift?\nUser: Yeah. I'm okay. Thank you for asking.\nAgent: \"Can you confirm that everything is secure on-site at the moment? Any incidents or concerns to report?\"\nUser: Yeah. Just one incidental report.\nAgent: Okay, um, are you alright and able to talk about what happened? Do you need to \nAgent: call \nUser: Yeah. No. I'm okay. There's no need to call the police.\nAgent: Got it, um, would you like me to log the incident for you now?\nUser: Yes, please. Yeah.\nAgent: Alright, I'll go ahead and log the incident for you. Could you please provide me with a brief description of what happened?\nUser: Yes. So there was a a drunk person who was walking by and started to bang on the door. It was nothing serious. And this happened around nine PM. In our Cronin site.\nAgent: Thanks for sharing that. Just to confirm, do you want me to officially log this incident for you now?\nUser: Yes, please. Yeah.\nAgent: Okay, I'm logging the incident about the drunk person banging on the door at the Cronin site around 9 PM. Is there anything else you want to add or any other incidents to report?\nUser: No. That's it. Thank you very much.\nAgent: You're welcome! Just to double-check, do you want me to officially log that incident for you now?",
            response_id: 7,
            recording_url: "https://dxc03zgurdly9.cloudfront.net/31c381758d59a665ed4cb8ebacb9d453328912677b00ec2ecb61dfd8671322f6/recording.wav",
            public_log_url: "https://dxc03zgurdly9.cloudfront.net/31c381758d59a665ed4cb8ebacb9d453328912677b00ec2ecb61dfd8671322f6/public.log",
            disconnection_reason: "user_hangup",
            total_duration_unit_price: 0.1500001,
            from_number: 447878725961,
            to_number: 447469023597,
            direction: "outbound"
          },
          {
            id: 2,
            call_id: "TEST-456",
            start_timestamp: Math.floor(Date.now() / 1000) - 7200,
            end_timestamp: Math.floor(Date.now() / 1000) - 7140,
            duration_ms: 60000,
            call_status: "missed",
            transcript: "Another sample transcript."
          }
        ] as CheckIn[];
        
        return {
          data: sampleData,
          total: sampleData.length
        };
      }
      
      query = query
        .range((page - 1) * perPage, page * perPage - 1)
        .order('start_timestamp', { ascending: false });
      
      const { data, error, count } = await query;
      
      console.log("Query response:", { data, error, count });
      
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
