export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      goals: {
        Row: {
          category: string | null
          completed: boolean | null
          created_at: string
          description: string | null
          id: string
          progress: number | null
          target_date: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          completed?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          progress?: number | null
          target_date?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          completed?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          progress?: number | null
          target_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          coach_notes: string | null
          confidence_level: number | null
          created_at: string
          date: string
          emotional_state: number | null
          feeling: string | null
          focus_level: number | null
          id: string
          next_goal: string | null
          personal_reflections: string | null
          session_type: string | null
          small_win: string | null
          user_id: string
          what_i_learned: string | null
          what_was_challenging: string | null
          what_went_well: string | null
          worked_on: string
        }
        Insert: {
          coach_notes?: string | null
          confidence_level?: number | null
          created_at?: string
          date?: string
          emotional_state?: number | null
          feeling?: string | null
          focus_level?: number | null
          id?: string
          next_goal?: string | null
          personal_reflections?: string | null
          session_type?: string | null
          small_win?: string | null
          user_id: string
          what_i_learned?: string | null
          what_was_challenging?: string | null
          what_went_well?: string | null
          worked_on: string
        }
        Update: {
          coach_notes?: string | null
          confidence_level?: number | null
          created_at?: string
          date?: string
          emotional_state?: number | null
          feeling?: string | null
          focus_level?: number | null
          id?: string
          next_goal?: string | null
          personal_reflections?: string | null
          session_type?: string | null
          small_win?: string | null
          user_id?: string
          what_i_learned?: string | null
          what_was_challenging?: string | null
          what_went_well?: string | null
          worked_on?: string
        }
        Relationships: []
      }
      jump_attempts: {
        Row: {
          created_at: string
          date: string
          id: string
          jump_type: string
          landed: boolean
          level: string
          notes: string | null
          quality: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          jump_type: string
          landed?: boolean
          level: string
          notes?: string | null
          quality?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          jump_type?: string
          landed?: boolean
          level?: string
          notes?: string | null
          quality?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          created_at: string
          height: number | null
          id: string
          main_focus: string | null
          name: string
          progress_feeling: string | null
          self_level: string | null
          trial_ends_at: string | null
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          height?: number | null
          id?: string
          main_focus?: string | null
          name: string
          progress_feeling?: string | null
          self_level?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          height?: number | null
          id?: string
          main_focus?: string | null
          name?: string
          progress_feeling?: string | null
          self_level?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      saved_quotes: {
        Row: {
          author: string
          category: string | null
          id: string
          quote: string
          saved_at: string
          user_id: string
        }
        Insert: {
          author: string
          category?: string | null
          id?: string
          quote: string
          saved_at?: string
          user_id: string
        }
        Update: {
          author?: string
          category?: string | null
          id?: string
          quote?: string
          saved_at?: string
          user_id?: string
        }
        Relationships: []
      }
      training_sessions: {
        Row: {
          activities: Json | null
          created_at: string
          date: string
          feeling: string | null
          id: string
          notes: string | null
          session_type: string
          total_duration: number
          user_id: string
        }
        Insert: {
          activities?: Json | null
          created_at?: string
          date?: string
          feeling?: string | null
          id?: string
          notes?: string | null
          session_type: string
          total_duration?: number
          user_id: string
        }
        Update: {
          activities?: Json | null
          created_at?: string
          date?: string
          feeling?: string | null
          id?: string
          notes?: string | null
          session_type?: string
          total_duration?: number
          user_id?: string
        }
        Relationships: []
      }
      weekly_goals: {
        Row: {
          created_at: string
          id: string
          jump_targets: Json | null
          off_ice_sessions_target: number | null
          on_ice_hours_target: number | null
          user_id: string
          week_start: string
        }
        Insert: {
          created_at?: string
          id?: string
          jump_targets?: Json | null
          off_ice_sessions_target?: number | null
          on_ice_hours_target?: number | null
          user_id: string
          week_start: string
        }
        Update: {
          created_at?: string
          id?: string
          jump_targets?: Json | null
          off_ice_sessions_target?: number | null
          on_ice_hours_target?: number | null
          user_id?: string
          week_start?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
