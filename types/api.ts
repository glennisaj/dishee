// Restaurant Types
export interface RestaurantDetails {
  name: string
  rating: number
  address: string
  reviews: Review[]
  cuisineType?: string
  businessHours?: {
    open: string
    close: string
  }
  phoneNumber?: string
  priceRange?: string
  totalReviews?: number
  lastFetched: string
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
  placeId: string
  name: string
  address: string
  rating: number
  timestamp: string
  cuisineType?: string
  priceRange?: string
  totalReviews?: number
}

export interface RecentlyAnalyzedResponse {
  restaurants: RecentlyAnalyzedRestaurant[]
  status: 'success' | 'error'
}

export interface Review {
  text: string
  rating: number
  time?: string
  author_name?: string
}
