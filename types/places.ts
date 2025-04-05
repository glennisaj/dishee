export type PlaceId = string

export interface GooglePlace {
  placeId: PlaceId
  name: string
  address: string
  photos?: string[]
  rating?: number
  reviews?: Review[]
  url?: string
  website?: string
  formatted_address?: string
}

export interface Review {
  text: string
  rating: number
  time?: number
  author_name?: string
}

export interface Prediction {
  placeId: PlaceId
  name: string
  address: string
}

export interface AnalyzedRestaurant extends GooglePlace {
  analysis?: DishAnalysis[]
  cached?: boolean
  timestamp?: string
}

export interface DishAnalysis {
  name: string
  sentiment: number
  mentions: number
  quotes?: string[]
}
