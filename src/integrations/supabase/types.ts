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
      feedback: {
        Row: {
          age: number | null
          created_at: string
          id: string
          message: string
          name: string
          skating_level: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string
          id?: string
          message: string
          name: string
          skating_level?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string
          id?: string
          message?: string
          name?: string
          skating_level?: string | null
        }
        Relationships: []
      }
      goals: {
        Row: {
          category: string | null
          completed: boolean | null
          created_at: string
          description: string | null
          id: string
          notes: string | null
          progress: number | null
          target_date: string | null
          timeframe: string
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
          notes?: string | null
          progress?: number | null
          target_date?: string | null
          timeframe?: string
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
          notes?: string | null
          progress?: number | null
          target_date?: string | null
          timeframe?: string
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
          goal_id: string | null
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
          goal_id?: string | null
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
          goal_id?: string | null
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
        Relationships: [
          {
            foreignKeyName: "journal_entries_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
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
      mind_journal_entries: {
        Row: {
          body_overall_feeling: number | null
          body_tension_areas: Json | null
          cbt_automatic_thought: string | null
          cbt_balanced_thought: string | null
          cbt_emotion: string | null
          cbt_emotion_intensity: number | null
          cbt_evidence_against: string | null
          cbt_evidence_for: string | null
          cbt_new_intensity: number | null
          cbt_situation: string | null
          created_at: string
          date: string
          emotion_notes: string | null
          emotion_primary: string | null
          emotion_secondary: string | null
          entry_type: string
          gratitude_items: Json | null
          id: string
          precomp_breathing_completed: boolean | null
          precomp_confidence_anchor: string | null
          precomp_event_date: string | null
          precomp_event_name: string | null
          precomp_intention: string | null
          precomp_visualization: string | null
          self_compassion_friend_response: string | null
          self_compassion_kind_message: string | null
          self_compassion_situation: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          body_overall_feeling?: number | null
          body_tension_areas?: Json | null
          cbt_automatic_thought?: string | null
          cbt_balanced_thought?: string | null
          cbt_emotion?: string | null
          cbt_emotion_intensity?: number | null
          cbt_evidence_against?: string | null
          cbt_evidence_for?: string | null
          cbt_new_intensity?: number | null
          cbt_situation?: string | null
          created_at?: string
          date?: string
          emotion_notes?: string | null
          emotion_primary?: string | null
          emotion_secondary?: string | null
          entry_type: string
          gratitude_items?: Json | null
          id?: string
          precomp_breathing_completed?: boolean | null
          precomp_confidence_anchor?: string | null
          precomp_event_date?: string | null
          precomp_event_name?: string | null
          precomp_intention?: string | null
          precomp_visualization?: string | null
          self_compassion_friend_response?: string | null
          self_compassion_kind_message?: string | null
          self_compassion_situation?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          body_overall_feeling?: number | null
          body_tension_areas?: Json | null
          cbt_automatic_thought?: string | null
          cbt_balanced_thought?: string | null
          cbt_emotion?: string | null
          cbt_emotion_intensity?: number | null
          cbt_evidence_against?: string | null
          cbt_evidence_for?: string | null
          cbt_new_intensity?: number | null
          cbt_situation?: string | null
          created_at?: string
          date?: string
          emotion_notes?: string | null
          emotion_primary?: string | null
          emotion_secondary?: string | null
          entry_type?: string
          gratitude_items?: Json | null
          id?: string
          precomp_breathing_completed?: boolean | null
          precomp_confidence_anchor?: string | null
          precomp_event_date?: string | null
          precomp_event_name?: string | null
          precomp_intention?: string | null
          precomp_visualization?: string | null
          self_compassion_friend_response?: string | null
          self_compassion_kind_message?: string | null
          self_compassion_situation?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mindfulness_tool_usage: {
        Row: {
          affirmation_text: string | null
          created_at: string
          date: string
          duration_seconds: number | null
          gratitude_items: Json | null
          id: string
          notes: string | null
          tool_type: string
          user_id: string
          visualization_event: string | null
        }
        Insert: {
          affirmation_text?: string | null
          created_at?: string
          date?: string
          duration_seconds?: number | null
          gratitude_items?: Json | null
          id?: string
          notes?: string | null
          tool_type: string
          user_id: string
          visualization_event?: string | null
        }
        Update: {
          affirmation_text?: string | null
          created_at?: string
          date?: string
          duration_seconds?: number | null
          gratitude_items?: Json | null
          id?: string
          notes?: string | null
          tool_type?: string
          user_id?: string
          visualization_event?: string | null
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
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
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
      get_admin_stats: { Args: never; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
