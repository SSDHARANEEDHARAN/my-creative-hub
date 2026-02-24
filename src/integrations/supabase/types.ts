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
      blog_comments: {
        Row: {
          content: string
          created_at: string
          email: string
          id: string
          is_approved: boolean
          is_spam: boolean
          name: string
          post_id: string
          reply: string | null
          reply_date: string | null
        }
        Insert: {
          content: string
          created_at?: string
          email: string
          id?: string
          is_approved?: boolean
          is_spam?: boolean
          name: string
          post_id: string
          reply?: string | null
          reply_date?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          email?: string
          id?: string
          is_approved?: boolean
          is_spam?: boolean
          name?: string
          post_id?: string
          reply?: string | null
          reply_date?: string | null
        }
        Relationships: []
      }
      blog_likes: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          post_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          post_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          post_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          category: string
          content: string
          cover_image: string | null
          created_at: string
          created_by: string | null
          excerpt: string
          id: string
          is_published: boolean
          published_at: string | null
          read_time: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          content: string
          cover_image?: string | null
          created_at?: string
          created_by?: string | null
          excerpt: string
          id?: string
          is_published?: boolean
          published_at?: string | null
          read_time?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          cover_image?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string
          id?: string
          is_published?: boolean
          published_at?: string | null
          read_time?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_views: {
        Row: {
          created_at: string
          id: string
          ip_hash: string | null
          post_id: string
          viewer_email: string | null
          viewer_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          post_id: string
          viewer_email?: string | null
          viewer_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          post_id?: string
          viewer_email?: string | null
          viewer_name?: string | null
        }
        Relationships: []
      }
      guest_visitors: {
        Row: {
          email: string
          id: string
          ip_address: string | null
          name: string
          user_agent: string | null
          visited_at: string
        }
        Insert: {
          email: string
          id?: string
          ip_address?: string | null
          name: string
          user_agent?: string | null
          visited_at?: string
        }
        Update: {
          email?: string
          id?: string
          ip_address?: string | null
          name?: string
          user_agent?: string | null
          visited_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean
          name: string | null
          source: string | null
          subscribed_at: string
          unsubscribe_token: string | null
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          name?: string | null
          source?: string | null
          subscribed_at?: string
          unsubscribe_token?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          name?: string | null
          source?: string | null
          subscribed_at?: string
          unsubscribe_token?: string | null
        }
        Relationships: []
      }
      otp_codes: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          otp: string
          used: boolean
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: string
          otp: string
          used?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          otp?: string
          used?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_likes: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          project_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          project_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          project_id?: string
        }
        Relationships: []
      }
      project_views: {
        Row: {
          created_at: string
          id: string
          ip_hash: string | null
          project_id: string
          viewer_email: string | null
          viewer_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          project_id: string
          viewer_email?: string | null
          viewer_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          project_id?: string
          viewer_email?: string | null
          viewer_name?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          article_slug: string | null
          category: string
          created_at: string
          created_by: string | null
          description: string
          featured: boolean | null
          github_url: string | null
          id: string
          images: string[] | null
          is_published: boolean
          live_url: string | null
          tech_stack: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          article_slug?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          description: string
          featured?: boolean | null
          github_url?: string | null
          id?: string
          images?: string[] | null
          is_published?: boolean
          live_url?: string | null
          tech_stack?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          article_slug?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          featured?: boolean | null
          github_url?: string | null
          id?: string
          images?: string[] | null
          is_published?: boolean
          live_url?: string | null
          tech_stack?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      blog_comments_public: {
        Row: {
          content: string | null
          created_at: string | null
          id: string | null
          is_approved: boolean | null
          name: string | null
          post_id: string | null
          reply: string | null
          reply_date: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string | null
          is_approved?: boolean | null
          name?: string | null
          post_id?: string | null
          reply?: string | null
          reply_date?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string | null
          is_approved?: boolean | null
          name?: string | null
          post_id?: string | null
          reply?: string | null
          reply_date?: string | null
        }
        Relationships: []
      }
      blog_likes_public: {
        Row: {
          created_at: string | null
          id: string | null
          name: string | null
          post_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          name?: string | null
          post_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          name?: string | null
          post_id?: string | null
        }
        Relationships: []
      }
      blog_view_counts: {
        Row: {
          post_id: string | null
          unique_viewers: number | null
          view_count: number | null
        }
        Relationships: []
      }
      project_likes_public: {
        Row: {
          created_at: string | null
          id: string | null
          name: string | null
          project_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          name?: string | null
          project_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          name?: string | null
          project_id?: string | null
        }
        Relationships: []
      }
      project_view_counts: {
        Row: {
          project_id: string | null
          unique_viewers: number | null
          view_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
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
