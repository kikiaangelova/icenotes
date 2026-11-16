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
      comeback_checkins: {
        Row: {
          can_train: string
          confidence: number
          created_at: string
          fear: number
          id: string
          looking_forward: string
          mood: number
          user_id: string
        }
        Insert: {
          can_train: string
          confidence: number
          created_at?: string
          fear: number
          id?: string
          looking_forward: string
          mood: number
          user_id: string
        }
        Update: {
          can_train?: string
          confidence?: number
          created_at?: string
          fear?: number
          id?: string
          looking_forward?: string
          mood?: number
          user_id?: string
        }
        Relationships: []
      }
      community_challenge_participants: {
        Row: {
          challenge_id: string
          joined_at: string
          progress: number
          user_id: string
        }
        Insert: {
          challenge_id: string
          joined_at?: string
          progress?: number
          user_id: string
        }
        Update: {
          challenge_id?: string
          joined_at?: string
          progress?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "community_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      community_challenges: {
        Row: {
          created_at: string
          ends_on: string
          group_id: string | null
          id: string
          starts_on: string
          target: number
          title_bg: string
          title_en: string
        }
        Insert: {
          created_at?: string
          ends_on: string
          group_id?: string | null
          id?: string
          starts_on?: string
          target: number
          title_bg: string
          title_en: string
        }
        Update: {
          created_at?: string
          ends_on?: string
          group_id?: string | null
          id?: string
          starts_on?: string
          target?: number
          title_bg?: string
          title_en?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_challenges_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      community_comments: {
        Row: {
          author_id: string
          created_at: string
          id: string
          phrase_key: string
          post_id: string
          status: string
        }
        Insert: {
          author_id: string
          created_at?: string
          id?: string
          phrase_key: string
          post_id: string
          status?: string
        }
        Update: {
          author_id?: string
          created_at?: string
          id?: string
          phrase_key?: string
          post_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_group_members: {
        Row: {
          group_id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          group_id: string
          joined_at?: string
          user_id: string
        }
        Update: {
          group_id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      community_groups: {
        Row: {
          created_at: string
          id: string
          invite_code: string | null
          is_general: boolean
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          invite_code?: string | null
          is_general?: boolean
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          invite_code?: string | null
          is_general?: boolean
          name?: string
        }
        Relationships: []
      }
      community_members: {
        Row: {
          age: number
          avatar_key: string
          created_at: string
          discipline: string | null
          is_blocked: boolean
          nickname: string
          role: string
          rules_accepted_at: string | null
          user_id: string
        }
        Insert: {
          age: number
          avatar_key?: string
          created_at?: string
          discipline?: string | null
          is_blocked?: boolean
          nickname: string
          role: string
          rules_accepted_at?: string | null
          user_id: string
        }
        Update: {
          age?: number
          avatar_key?: string
          created_at?: string
          discipline?: string | null
          is_blocked?: boolean
          nickname?: string
          role?: string
          rules_accepted_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          author_id: string
          body: string | null
          created_at: string
          flags: string[]
          group_id: string
          id: string
          kind: string
          status: string
          template_key: string | null
        }
        Insert: {
          author_id: string
          body?: string | null
          created_at?: string
          flags?: string[]
          group_id: string
          id?: string
          kind: string
          status?: string
          template_key?: string | null
        }
        Update: {
          author_id?: string
          body?: string | null
          created_at?: string
          flags?: string[]
          group_id?: string
          id?: string
          kind?: string
          status?: string
          template_key?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      community_reactions: {
        Row: {
          created_at: string
          kind: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          kind: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          kind?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_reports: {
        Row: {
          comment_id: string | null
          created_at: string
          id: string
          post_id: string | null
          reporter_id: string
          resolved: boolean
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          reporter_id: string
          resolved?: boolean
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          reporter_id?: string
          resolved?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "community_reports_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "community_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          consent: boolean
          created_at: string
          email: string
          id: string
          locale: string
          message: string
          name: string
        }
        Insert: {
          consent: boolean
          created_at?: string
          email: string
          id?: string
          locale: string
          message: string
          name: string
        }
        Update: {
          consent?: boolean
          created_at?: string
          email?: string
          id?: string
          locale?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          age: number | null
          created_at: string
          id: string
          message: string
          name: string
          skating_level: string | null
          user_id: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string
          id?: string
          message: string
          name: string
          skating_level?: string | null
          user_id?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string
          id?: string
          message?: string
          name?: string
          skating_level?: string | null
          user_id?: string | null
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
          confidence_note: string | null
          created_at: string
          date: string
          emotional_state: number | null
          emotional_state_note: string | null
          feeling: string | null
          focus_level: number | null
          focus_note: string | null
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
          confidence_note?: string | null
          created_at?: string
          date?: string
          emotional_state?: number | null
          emotional_state_note?: string | null
          feeling?: string | null
          focus_level?: number | null
          focus_note?: string | null
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
          confidence_note?: string | null
          created_at?: string
          date?: string
          emotional_state?: number | null
          emotional_state_note?: string | null
          feeling?: string | null
          focus_level?: number | null
          focus_note?: string | null
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
          postcomp_carry_forward: string | null
          postcomp_did_well: string | null
          postcomp_surprise: string | null
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
          postcomp_carry_forward?: string | null
          postcomp_did_well?: string | null
          postcomp_surprise?: string | null
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
          postcomp_carry_forward?: string | null
          postcomp_did_well?: string | null
          postcomp_surprise?: string | null
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
      parent_articles: {
        Row: {
          body_bg: string
          body_en: string
          created_at: string
          id: string
          published: boolean
          title_bg: string
          title_en: string
        }
        Insert: {
          body_bg: string
          body_en: string
          created_at?: string
          id?: string
          published?: boolean
          title_bg: string
          title_en: string
        }
        Update: {
          body_bg?: string
          body_en?: string
          created_at?: string
          id?: string
          published?: boolean
          title_bg?: string
          title_en?: string
        }
        Relationships: []
      }
      parent_comments: {
        Row: {
          author_id: string
          body: string
          created_at: string
          flags: string[]
          id: string
          post_id: string
          status: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          flags?: string[]
          id?: string
          post_id: string
          status?: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          flags?: string[]
          id?: string
          post_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "parent_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_links: {
        Row: {
          confirmed_at: string | null
          created_at: string
          id: string
          parent_email: string
          parent_id: string | null
          skater_id: string
          status: string
          token_hash: string
        }
        Insert: {
          confirmed_at?: string | null
          created_at?: string
          id?: string
          parent_email: string
          parent_id?: string | null
          skater_id: string
          status?: string
          token_hash: string
        }
        Update: {
          confirmed_at?: string | null
          created_at?: string
          id?: string
          parent_email?: string
          parent_id?: string | null
          skater_id?: string
          status?: string
          token_hash?: string
        }
        Relationships: []
      }
      parent_posts: {
        Row: {
          author_id: string
          body: string
          created_at: string
          flags: string[]
          id: string
          status: string
          topic: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          flags?: string[]
          id?: string
          status?: string
          topic: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          flags?: string[]
          id?: string
          status?: string
          topic?: string
        }
        Relationships: []
      }
      parent_reports: {
        Row: {
          comment_id: string | null
          created_at: string
          id: string
          post_id: string | null
          reporter_id: string
          resolved: boolean
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          reporter_id: string
          resolved?: boolean
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          reporter_id?: string
          resolved?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "parent_reports_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "parent_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "parent_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      pilot_waitlist: {
        Row: {
          age_group: string | null
          club: string | null
          consent: boolean
          created_at: string
          email: string
          first_name: string
          id: string
          locale: string
          note: string | null
          role: string
        }
        Insert: {
          age_group?: string | null
          club?: string | null
          consent: boolean
          created_at?: string
          email: string
          first_name: string
          id?: string
          locale: string
          note?: string | null
          role: string
        }
        Update: {
          age_group?: string | null
          club?: string | null
          consent?: boolean
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          locale?: string
          note?: string | null
          role?: string
        }
        Relationships: []
      }
      prestart_routines: {
        Row: {
          body: string
          breath: string
          focus: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          breath: string
          focus: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          breath?: string
          focus?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          biggest_challenge: string | null
          club: string | null
          created_at: string
          current_elements: string | null
          dismissed_weight_prompt: boolean
          height: number | null
          id: string
          language: string
          main_focus: string | null
          name: string
          next_competition: string | null
          next_competition_date: string | null
          progress_feeling: string | null
          self_level: string | null
          skating_category: string | null
          support_areas: string[]
          support_style: string | null
          trial_ends_at: string | null
          updated_at: string
          useful_note: string | null
          user_id: string
          weight: number | null
          years_skating: number | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          biggest_challenge?: string | null
          club?: string | null
          created_at?: string
          current_elements?: string | null
          dismissed_weight_prompt?: boolean
          height?: number | null
          id?: string
          language?: string
          main_focus?: string | null
          name: string
          next_competition?: string | null
          next_competition_date?: string | null
          progress_feeling?: string | null
          self_level?: string | null
          skating_category?: string | null
          support_areas?: string[]
          support_style?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          useful_note?: string | null
          user_id: string
          weight?: number | null
          years_skating?: number | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          biggest_challenge?: string | null
          club?: string | null
          created_at?: string
          current_elements?: string | null
          dismissed_weight_prompt?: boolean
          height?: number | null
          id?: string
          language?: string
          main_focus?: string | null
          name?: string
          next_competition?: string | null
          next_competition_date?: string | null
          progress_feeling?: string | null
          self_level?: string | null
          skating_category?: string | null
          support_areas?: string[]
          support_style?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          useful_note?: string | null
          user_id?: string
          weight?: number | null
          years_skating?: number | null
        }
        Relationships: []
      }
      risk_events: {
        Row: {
          created_at: string
          id: string
          level: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          level: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          level?: string
          user_id?: string
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
      skater_element_history: {
        Row: {
          code: string
          created_at: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          status: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      skater_elements: {
        Row: {
          code: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          code: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          code?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      skater_share_settings: {
        Row: {
          share_elements: boolean
          share_goals: boolean
          share_streak: boolean
          skater_id: string
          updated_at: string
        }
        Insert: {
          share_elements?: boolean
          share_goals?: boolean
          share_streak?: boolean
          skater_id: string
          updated_at?: string
        }
        Update: {
          share_elements?: boolean
          share_goals?: boolean
          share_streak?: boolean
          skater_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      training_sessions: {
        Row: {
          activities: Json | null
          created_at: string
          date: string
          energy: string | null
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
          energy?: string | null
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
          energy?: string | null
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
      community_can_participate: { Args: { _uid: string }; Returns: boolean }
      community_can_view_group: {
        Args: { _gid: string; _uid: string }
        Returns: boolean
      }
      community_can_view_post: {
        Args: { _pid: string; _uid: string }
        Returns: boolean
      }
      community_challenge_list: { Args: never; Returns: Json }
      community_feed: { Args: { _group: string }; Returns: Json }
      community_join_group: { Args: { _code: string }; Returns: string }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      gdpr_delete_account_data: {
        Args: { account_email: string; target_user_id: string }
        Returns: undefined
      }
      get_admin_stats: { Args: never; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      parent_can_participate: { Args: { _uid: string }; Returns: boolean }
      parent_child_view: { Args: never; Returns: Json }
      parent_feed: { Args: { _topic: string }; Returns: Json }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
