export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          subscription_status: 'free' | 'premium'
          queries_used: number
          queries_reset_at: string
          created_at: string
          is_recruiter: boolean | null
          recruiter_company: string | null
          college_name: string | null
          xp_points: number | null
          current_streak: number | null
          total_lessons_completed: number | null
          total_quizzes_passed: number | null
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          subscription_status?: 'free' | 'premium'
          queries_used?: number
          queries_reset_at?: string
          created_at?: string
          is_recruiter?: boolean | null
          recruiter_company?: string | null
          college_name?: string | null
          xp_points?: number | null
          current_streak?: number | null
          total_lessons_completed?: number | null
          total_quizzes_passed?: number | null
        }
        Update: {
          email?: string | null
          full_name?: string | null
          subscription_status?: 'free' | 'premium'
          queries_used?: number
          queries_reset_at?: string
          is_recruiter?: boolean | null
          recruiter_company?: string | null
          college_name?: string | null
          xp_points?: number | null
          current_streak?: number | null
          total_lessons_completed?: number | null
          total_quizzes_passed?: number | null
        }
      }
      subjects: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          color: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          color?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          order_index?: number
        }
      }
      lessons: {
        Row: {
          id: string
          subject_id: string
          title: string
          slug: string
          content: string
          summary: string | null
          is_premium: boolean
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          title: string
          slug: string
          content: string
          summary?: string | null
          is_premium?: boolean
          order_index?: number
          created_at?: string
        }
        Update: {
          title?: string
          slug?: string
          content?: string
          summary?: string | null
          is_premium?: boolean
          order_index?: number
        }
      }
      lesson_embeddings: {
        Row: {
          id: string
          lesson_id: string
          chunk_text: string
          embedding: number[] | null
          chunk_index: number
          created_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          chunk_text: string
          embedding?: number[] | null
          chunk_index?: number
          created_at?: string
        }
        Update: {
          chunk_text?: string
          embedding?: number[] | null
          chunk_index?: number
        }
      }
      materials: {
        Row: {
          id: string
          name: string
          family: string
          density: number | null
          melt_temp: string | null
          tensile_strength: string | null
          top_applications: string[] | null
          indian_trade_names: string[] | null
          is_premium: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          family: string
          density?: number | null
          melt_temp?: string | null
          tensile_strength?: string | null
          top_applications?: string[] | null
          indian_trade_names?: string[] | null
          is_premium?: boolean
          created_at?: string
        }
        Update: {
          name?: string
          family?: string
          density?: number | null
          melt_temp?: string | null
          tensile_strength?: string | null
          top_applications?: string[] | null
          indian_trade_names?: string[] | null
          is_premium?: boolean
        }
      }
      videos: {
        Row: {
          id: string
          title: string
          youtube_url: string
          subject_id: string | null
          is_premium: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          youtube_url: string
          subject_id?: string | null
          is_premium?: boolean
          created_at?: string
        }
        Update: {
          title?: string
          youtube_url?: string
          subject_id?: string | null
          is_premium?: boolean
        }
      }
      payment_requests: {
        Row: {
          id: string
          user_id: string
          screenshot_url: string | null
          status: 'pending' | 'approved' | 'rejected'
          amount: number
          created_at: string
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          screenshot_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          amount?: number
          created_at?: string
          reviewed_at?: string | null
        }
        Update: {
          screenshot_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          reviewed_at?: string | null
        }
      }
      sponsored_challenges: {
        Row: {
          id: string
          title: string
          company_name: string
          description: string
          prize_pool: string
          difficulty: 'Easy' | 'Medium' | 'Hard'
          deadline: string
          criteria: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          company_name: string
          description: string
          prize_pool: string
          difficulty?: 'Easy' | 'Medium' | 'Hard'
          deadline: string
          criteria: string
          created_at?: string
        }
        Update: {
          title?: string
          company_name?: string
          description?: string
          prize_pool?: string
          difficulty?: 'Easy' | 'Medium' | 'Hard'
          deadline?: string
          criteria?: string
        }
      }
      challenge_submissions: {
        Row: {
          id: string
          challenge_id: string
          user_id: string
          solution_text: string
          solution_url: string | null
          status: 'pending' | 'accepted' | 'rejected'
          review_feedback: string | null
          xp_rewarded: number
          created_at: string
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          challenge_id: string
          user_id: string
          solution_text: string
          solution_url?: string | null
          status?: 'pending' | 'accepted' | 'rejected'
          review_feedback?: string | null
          xp_rewarded?: number
          created_at?: string
          reviewed_at?: string | null
        }
        Update: {
          solution_text?: string
          solution_url?: string | null
          status?: 'pending' | 'accepted' | 'rejected'
          review_feedback?: string | null
          xp_rewarded?: number
          reviewed_at?: string | null
        }
      }
      enterprise_inquiries: {
        Row: {
          id: string
          company_name: string
          contact_name: string
          email: string
          phone: string | null
          interest_area: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          company_name: string
          contact_name: string
          email: string
          phone?: string | null
          interest_area: string
          message: string
          created_at?: string
        }
        Update: {
          company_name?: string
          contact_name?: string
          email?: string
          phone?: string | null
          interest_area?: string
          message?: string
        }
      }
      three_d_models: {
        Row: {
          id: string
          name: string
          description: string
          category: 'material' | 'product' | 'molecule' | 'machine'
          material_slug: string | null
          model_type: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: 'material' | 'product' | 'molecule' | 'machine'
          material_slug?: string | null
          model_type: string
          created_at?: string
        }
        Update: {
          name?: string
          description?: string
          category?: 'material' | 'product' | 'molecule' | 'machine'
          material_slug?: string | null
          model_type?: string
        }
      }
      student_projects: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          category: 'research' | 'design' | 'processing' | 'recycling' | 'product'
          status: 'draft' | 'published' | 'archived'
          image_url: string | null
          github_url: string | null
          team_members: string[] | null
          guide_name: string | null
          guide_org: string | null
          tags: string[] | null
          upvotes: number
          views: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          category: 'research' | 'design' | 'processing' | 'recycling' | 'product'
          status?: 'draft' | 'published' | 'archived'
          image_url?: string | null
          github_url?: string | null
          team_members?: string[] | null
          guide_name?: string | null
          guide_org?: string | null
          tags?: string[] | null
          upvotes?: number
          views?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string
          category?: 'research' | 'design' | 'processing' | 'recycling' | 'product'
          status?: 'draft' | 'published' | 'archived'
          image_url?: string | null
          github_url?: string | null
          team_members?: string[] | null
          guide_name?: string | null
          guide_org?: string | null
          tags?: string[] | null
          upvotes?: number
          views?: number
          updated_at?: string
        }
      }
      project_upvotes: {
        Row: {
          id: string
          user_id: string
          project_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          project_id?: string
        }
      }
      project_comments: {
        Row: {
          id: string
          project_id: string
          user_id: string
          comment_text: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          comment_text: string
          created_at?: string
        }
        Update: {
          comment_text?: string
        }
      }
      user_lesson_notes: {
        Row: {
          id: string
          user_id: string
          lesson_slug: string
          content: string
          note_title: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_slug: string
          content: string
          note_title?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          content?: string
          note_title?: string | null
          updated_at?: string
        }
      }
    }
    Functions: {
      match_lesson_chunks: {
        Args: {
          query_embedding: number[]
          match_threshold?: number
          match_count?: number
        }
        Returns: {
          id: string
          lesson_id: string
          chunk_text: string
          similarity: number
        }[]
      }
      reset_daily_queries: {
        Args: { user_id: string }
        Returns: void
      }
    }
  }
}
