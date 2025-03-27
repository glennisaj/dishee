import { supabase } from './supabase'
import { Database } from '@/types/supabase'

type Restaurant = Database['public']['Tables']['restaurants']['Row']
type Dish = Database['public']['Tables']['dishes']['Row']

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

export async function getRestaurantWithDishes(placeId: string) {
  // Check if we have a recent analysis
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select(`
      *,
      dishes (*)
    `)
    .eq('id', placeId)
    .single()

  if (restaurant && isAnalysisRecent(restaurant.last_analyzed)) {
    return restaurant
  }

  return null
}

export async function saveRestaurantAnalysis(
  placeId: string,
  restaurantData: Omit<Restaurant, 'id' | 'created_at' | 'updated_at'>,
  dishes: Omit<Dish, 'id' | 'restaurant_id' | 'created_at' | 'updated_at'>[]
) {
  // Start a transaction
  const { data, error } = await supabase.rpc('save_restaurant_analysis', {
    p_restaurant_id: placeId,
    p_restaurant_data: restaurantData,
    p_dishes: dishes
  })

  if (error) throw error
  return data
}

export async function getRecentlyAnalyzed() {
  const { data, error } = await supabase
    .from('recently_analyzed_restaurants')
    .select('*')

  if (error) throw error
  return data
}

function isAnalysisRecent(lastAnalyzed: string | null): boolean {
  if (!lastAnalyzed) return false
  const analysisDate = new Date(lastAnalyzed).getTime()
  const now = new Date().getTime()
  return now - analysisDate < CACHE_DURATION
}
