// Restaurant Types
export interface RestaurantDetails {
  name: string
  rating: number
  address: string
  reviews: Review[]
}

// Dish Analysis Types
export interface DishAnalysis {
  name: string
  description: string
  quote?: string
  mentions?: number
  rank?: number
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
  status: string
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

export interface Review {
  text: string
  rating: number
  time: number
}
