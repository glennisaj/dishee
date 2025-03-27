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
      restaurants: {
        Row: {
          id: string
          name: string
          address: string | null
          rating: number | null
          review_count: number | null
          last_analyzed: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          address?: string | null
          rating?: number | null
          review_count?: number | null
          last_analyzed?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          rating?: number | null
          review_count?: number | null
          last_analyzed?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      dishes: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          rank: number
          description: string | null
          quote: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          rank: number
          description?: string | null
          quote?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          rank?: number
          description?: string | null
          quote?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      recently_analyzed_restaurants: {
        Row: {
          id: string
          name: string
          address: string | null
          rating: number | null
          last_analyzed: string | null
          dish_count: number
        }
      }
    }
  }
}
