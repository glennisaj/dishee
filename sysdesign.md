# Dishee System Design

```ascii
+------------------+     +-----------------+
|   Client/Browser |     |  Vercel (Host)  |
|    Next.js UI    |     |   Next.js App   |
+--------+---------+     +--------+--------+
         |                        |
         |                        |
+--------+---------+     +--------+--------+
|  API Routes      |     |  Redis Cache    |
|  (Server-side)   |     |  (Upstash)     |
+--------+---------+     +----------------+
         |
         |
+--------+------+  +-------------+  +--------------+
| Google Places |  |   OpenAI    |  |  Supabase    |
|     API      |  |     API     |  |  Database    |
+---------------+  +-------------+  +--------------+
```

## Component Explanations

### 1. Frontend (Client-side)
**What it does:**
- Shows the search box and results
- Displays restaurant information
- Shows loading states and errors
- Handles user interactions

**How it works:**
- Built with Next.js and React
- Runs in your web browser
- Makes requests to our API routes
- Updates the screen with results

### 2. Vercel (Hosting)
**What it does:**
- Hosts your website
- Makes it available on the internet
- Handles deployment and scaling

**How it works:**
- Takes your code from GitHub
- Builds and serves your application
- Provides analytics and monitoring
- Manages environment variables

### 3. API Routes (Server-side)
**What it does:**
- Handles requests from the frontend
- Protects your API keys
- Coordinates between services

**How it works:**
- Receives requests from frontend
- Calls external APIs securely
- Processes and returns data
- Manages caching

### 4. Redis Cache (Upstash)
**What it does:**
- Stores recent restaurants
- Caches analysis results
- Makes the app faster

**How it works:**
- Saves data in memory
- Provides quick access
- Reduces API calls
- Stores temporary data

### 5. External APIs

#### Google Places API
**What it does:**
- Finds restaurants
- Gets restaurant details
- Provides reviews

**How it works:**
- Receives search queries
- Returns restaurant matches
- Provides review data
- Gives location information

#### OpenAI API
**What it does:**
- Analyzes reviews
- Identifies top dishes
- Generates insights

**How it works:**
- Receives review text
- Processes language
- Identifies patterns
- Returns analysis

#### Supabase Database
**What it does:**
- Stores user data
- Saves long-term information
- Manages authentication

**How it works:**
- Persistent data storage
- Secure user management
- Real-time capabilities

## Data Flow Example

1. **Search Flow:**
User types "pizza" →
Frontend sends request →
API route receives request →
Calls Google Places API →
Returns restaurant matches →
Shows results to user

2. **Analysis Flow:**
User selects restaurant →
API route fetches reviews →
Checks Redis cache →
If not cached:
Gets reviews from Google
Sends to OpenAI for analysis
Saves in Redis
Returns analysis to user

3. **Recent Restaurants Flow:**
User views analysis →
Restaurant saved to Redis →
Recent list updated →
Shown on homepage →
Limited to 4 entries

## Security Features
- API keys stored server-side
- Rate limiting implemented
- Error handling throughout
- Data validation
- Secure headers

# Dishee File Structure Explained Simply

## 📁 app (Main Folder)
Think of this as your main toy box where all your toys are organized!

### 📄 layout.tsx
- This is like the walls and roof of your house
- Every page uses this as its container
- Has the navigation bar at the top

### 📄 page.tsx
- This is your front door (homepage)
- Shows the search box
- Shows recently analyzed restaurants
- Has the "How it Works" section

### 📁 components (Special Tools)
Like having different toy sets for different games:

#### 📄 HeroSection.tsx
- The big welcome sign
- Has the main search box
- Makes things look pretty when you first arrive

#### 📄 SearchAutocomplete.tsx
- The magic search box
- Helps you find restaurants as you type
- Like having a friend suggest restaurants

#### 📄 RecentlyAnalyzed.tsx
- Shows restaurants you looked at before
- Like keeping a list of your favorite places
- Shows the last 4 restaurants you checked

#### 📄 LoadingState.tsx
- The "please wait" screen
- Shows spinning circles while things load
- Tells you what's happening behind the scenes

### 📁 api (Kitchen Where Food is Made)
Like having different cooking stations:

#### 📄 analyze-reviews/route.ts
- The chef that reads all the reviews
- Finds the best dishes people talk about
- Uses AI to understand what people liked

#### 📄 places/search/route.ts
- Helps find restaurants
- Like having a restaurant directory
- Talks to Google to get information

### 📁 results
Where you see what dishes are good at each restaurant:

#### 📄 [placeId]/page.tsx
- Shows all the details about one restaurant
- Lists the best dishes
- Shows what people said in reviews

## 📁 utils (Helper Tools)
Like having a toolbox with different tools:

### 📄 google-places.ts
- Talks to Google to find restaurants
- Gets reviews and information
- Like having a restaurant phone book

### 📄 redis.ts
- Remembers things for later
- Like having a notebook to write things down
- Saves information so we don't have to look it up again

## Important Files

### 📄 .env.local
- Contains secret passwords
- Like having a special key to open different doors
- Keeps our secrets safe

### 📄 next.config.js
- Rules for how everything works
- Like having instructions for building with LEGO
- Tells the computer how to run everything

## How Everything Works Together

Imagine making a sandwich:
1. You open the front door (page.tsx)
2. Use the search box (SearchAutocomplete) to find a restaurant
3. The kitchen (api) talks to Google to find it
4. The chef (analyze-reviews) reads all the reviews
5. The notebook (redis) remembers what we found
6. Finally, you see the best dishes!

## Special Features

### Search Box
- Type restaurant name
- See suggestions appear
- Click to choose one

### Restaurant Analysis
- Shows top dishes
- What people liked
- Saves for later

### Recent Restaurants
- Shows places you looked at
- Easy to find again
- Like breadcrumbs to find your way back

Would you like me to:
1. Explain any part in more detail?
2. Add more examples?
3. Make any section clearer?
4. Add pictures or diagrams?

Remember: Every file has a special job, just like every toy in your toy box has a special purpose! 🧸