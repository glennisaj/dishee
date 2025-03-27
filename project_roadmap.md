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




## Progress Update (Today's Achievements)
✅ URL Processing
- Created URL validation for both full and shortened Google Maps URLs
- Implemented Google Places API integration
- Successfully fetching restaurant details and reviews
- Added loading states and error handling
- Optimized processing for shortened URLs

## Next Steps
- Implement OpenAI integration for review analysis
- Create dish identification algorithm
- Design and implement results display
- Add error handling for API failures
