export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      checkins_raw: {
        Row: {
          agent_id: string | null
          call_id: string | null
          call_status: string | null
          call_type: string | null
          direction: string | null
          disconnection_reason: string | null
          duration_ms: number | null
          end_timestamp: number | null
          event: string | null
          from_number: number | null
          id: number
          public_log_url: string | null
          recording_url: string | null
          response_id: number | null
          start_timestamp: number | null
          to_number: number | null
          total_duration_unit_price: number | null
          transcript: string | null
        }
        Insert: {
          agent_id?: string | null
          call_id?: string | null
          call_status?: string | null
          call_type?: string | null
          direction?: string | null
          disconnection_reason?: string | null
          duration_ms?: number | null
          end_timestamp?: number | null
          event?: string | null
          from_number?: number | null
          id: number
          public_log_url?: string | null
          recording_url?: string | null
          response_id?: number | null
          start_timestamp?: number | null
          to_number?: number | null
          total_duration_unit_price?: number | null
          transcript?: string | null
        }
        Update: {
          agent_id?: string | null
          call_id?: string | null
          call_status?: string | null
          call_type?: string | null
          direction?: string | null
          disconnection_reason?: string | null
          duration_ms?: number | null
          end_timestamp?: number | null
          event?: string | null
          from_number?: number | null
          id?: number
          public_log_url?: string | null
          recording_url?: string | null
          response_id?: number | null
          start_timestamp?: number | null
          to_number?: number | null
          total_duration_unit_price?: number | null
          transcript?: string | null
        }
        Relationships: []
      }
      incident_reports: {
        Row: {
          created_at: string
          current_version_id: string | null
          id: string
          location: string
          reported_by_user_id: string
          severity: string
          site_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_version_id?: string | null
          id?: string
          location: string
          reported_by_user_id: string
          severity: string
          site_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_version_id?: string | null
          id?: string
          location?: string
          reported_by_user_id?: string
          severity?: string
          site_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_current_version"
            columns: ["current_version_id"]
            isOneToOne: false
            referencedRelation: "incident_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_versions: {
        Row: {
          attachment_urls: Json | null
          created_at: string
          created_by_user_id: string
          description: string
          id: string
          incident_id: string
          status: string
        }
        Insert: {
          attachment_urls?: Json | null
          created_at?: string
          created_by_user_id: string
          description: string
          id?: string
          incident_id: string
          status: string
        }
        Update: {
          attachment_urls?: Json | null
          created_at?: string
          created_by_user_id?: string
          description?: string
          id?: string
          incident_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "incident_versions_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incident_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          channel: string
          content: string
          created_at: string
          error_message: string | null
          id: string
          recipient: string
          related_id: string | null
          sent_at: string | null
          status: string
          title: string
          type: string
        }
        Insert: {
          channel: string
          content: string
          created_at?: string
          error_message?: string | null
          id?: string
          recipient: string
          related_id?: string | null
          sent_at?: string | null
          status: string
          title: string
          type: string
        }
        Update: {
          channel?: string
          content?: string
          created_at?: string
          error_message?: string | null
          id?: string
          recipient?: string
          related_id?: string | null
          sent_at?: string | null
          status?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      user_has_site_access: {
        Args: { user_id: string; site_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
