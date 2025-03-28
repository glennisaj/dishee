// Restaurant Types
export interface RestaurantDetails {
  name: string
  rating: number | null
  address: string | null
  reviews?: {  // Make it optional since it might not always be present
    length: number
  }
}

// Dish Analysis Types
export interface DishAnalysis {
  name: string
  rank: number
  description: string
  quote: string
}

// API Response Types
export interface AnalyzeReviewsResponse {
  restaurantName: RestaurantDetails
  dishes: DishAnalysis[]
  status: 'success' | 'error'
  source: 'cache' | 'fresh'
}

export interface ErrorResponse {
  error: string
  status: number
}

// API Request Types
export interface AnalyzeReviewsRequest {
  placeId: string
}

// Recently Analyzed Types
export interface RecentlyAnalyzedRestaurant {
  id: string
  name: string
  address: string
  rating: number
  last_analyzed: string
}

export interface RecentlyAnalyzedResponse {
  restaurants: RecentlyAnalyzedRestaurant[]
  status: 'success' | 'error'
}
