estaurant Dish Finder
A simple web application that analyzes Google Maps restaurant reviews to find the most popular dishes.
Lets call the website "Dishee"




Requirements
Accept Google Maps URLs in two formats:
Full URL (e.g., https://www.google.com/maps/place/...)
Shortened URL (e.g., https://maps.app.goo.gl/...)




Include a clear Call-to-Action (CTA) button for users to submit the URL
Process last 60 days of reviews using OpenAI API to identify top dishes
Display results on a new page showing:
Up to 3 most popular dishes
Brief description of each dish
Optional: relevant quote from reviews for each dish




Tech Stack
Thought for 1 second### Tech Stack for the Restaurant Dish Recommender


The Restaurant Dish Recommender site is built using a modern web development stack that combines several technologies:


## Core Framework


- **Next.js**: A React framework that provides server-side rendering, static site generation, and API routes. We're using the App Router architecture (Next.js 13+) which offers improved routing, layouts, and server components.




## Frontend


- **React**: The JavaScript library for building user interfaces
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development




## UI Components


- **shadcn/ui**: A collection of reusable components built with Radix UI and styled with Tailwind CSS
- **Lucide React**: For modern, clean SVG icons




## Backend


- **Next.js Server Actions**: For handling server-side logic directly from client components
- **AI SDK**: Vercel's AI SDK for integrating with OpenAI's models




## AI Integration


- **OpenAI API**: Used via the AI SDK to analyze restaurant reviews and identify top dishes
- **@ai-sdk/openai**: The OpenAI integration for the AI SDK




## Database


- **Supabase**: A PostgreSQL database with a RESTful API for storing and retrieving restaurant and dish data. I am a beginner but my thought for back end is to store restaurants and the top 3 dishes so can cache results and not have to hit the API every time. this is to save money using google places api. Likely will need to create a table for restaurants and a table for dishes.
- **PostgreSQL**: The underlying relational database used by Supabase




## State Management


- **React Hooks**: For local state management (useState, useEffect)




## Styling


- **Tailwind CSS**: For styling with utility classes
- **CSS Variables**: For theming and dark mode support




## Deployment Options


- **Vercel**: Optimized for deployment on Vercel (though it can be deployed elsewhere)




## Development Tools


- **npm/Node.js**: Package management and runtime
- **ESLint**: For code linting
- **next-themes**: For theme management (light/dark mode)




## Google Places API(New) Do not use the legacy API
Google Places API (New) to use for reviews and place_id


## Github
here is the link to the repo: https://github.com/glennisaj/dishee
I will need to create a new repo for this project. I am a beginner so I will need to learn how to do this.
I also will need to learn how to use the terminal to navigate the file system and make changes to the code.




Roadmap/Milestones
1. Project Setup
Initialize Next.js project
Set up Supabase integration
Configure OpenAI API access




2. URL Processing
Create URL input form
Implement parsing for both URL formats
Add basic validation




3.Review Analysis
Build OpenAI API integration
Develop review fetching for 60-day period
Create dish identification algorithm




4. Results Display
Design results page layout
Implement dish ranking system
Add description and quote components




5. Polish & Deploy
Add error handling
Style frontend
Deploy to hosting platform

# Restaurant Dish Finder (Dishee)

## Recent Achievements (3/28)

✅ **OpenAI Prompt Optimization**
- Implemented hybrid optimized prompt system
- Reduced token usage through concise descriptions
- Limited results to top 3 dishes for efficiency
- Standardized description format (3-word format)
- Added specific quote extraction rules
- Improved ranking accuracy with mention counting

Key Improvements:
- **Description Format**: Standardized to "[Texture/Taste] [Main ingredient] [Standout]"
- **Quote Selection**: Limited to 12 words for conciseness
- **Results Limit**: Enforced top 3 dishes only
- **Ranking System**: Added mention counting for better accuracy

## Next Steps

1. **Further OpenAI Optimizations**
   - Implement review pre-processing to reduce token usage
   - Test different temperature settings
   - Add response validation
   - Monitor and optimize token costs

2. **Performance Optimization**
   - Implement parallel processing
   - Add progressive loading
   - Optimize client-side caching
   - Improve response times

3. **User Experience Improvements**
   - Enhanced loading states
   - Partial results display
   - Error recovery mechanisms
   - Offline capabilities

4. **API Cost Management**
   - Optimize Google Places API requests
   - Implement rate limiting
   - Add usage monitoring
   - Track cost metrics


## Progress Update (3/27 Achievements)
✅ Search Optimization & UX Improvements
- Implemented Google Places Autocomplete for instant search
- Added location-based restaurant suggestions
- Improved response times and reduced API calls
- Enhanced UI with proper loading states and error handling
- Added Google attribution as per API requirements

## Technical Improvements
- Streamlined data flow by removing URL parsing
- Added geolocation support with fallback
- Improved error handling for location services
- Enhanced mobile responsiveness
- Cleaned up unused utilities and endpoints

## Current Features
- Instant restaurant search with autocomplete
- Location-aware suggestions
- AI-powered dish analysis
- Clean, modern UI with proper loading states
- Responsive design for all devices

## Next Steps
1. Database Integration
   - Set up Supabase tables for restaurants and dishes
   - Implement caching logic for API responses
   - Add data persistence layer

2. Performance Optimization
   - Implement request caching
   - Add rate limiting
   - Optimize API calls

3. UI/UX Enhancements
   - Add animations for smoother transitions
   - Implement keyboard navigation
   - Add share functionality for recommendations

4. Deployment
   - Set up production environment
   - Configure proper error logging
   - Implement monitoring


github commands: