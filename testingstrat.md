# Testing Strategy for Dishee

## Local Development Workflow

### Development Mode
```bash
npm run dev   # Start development server on http://localhost:3000
```

### Production Build Test
```bash
npm run build # Build production version
npm run start # Test production build locally
```

## Testing Checklist

### Core Features
- [ ] Search functionality
  - Type in search box
  - Check autocomplete
  - Verify predictions
  - Test selection

- [ ] Restaurant Analysis
  - Search for restaurant
  - Trigger analysis
  - Check loading states
  - Verify results display

- [ ] Recent Restaurants
  - Check display
  - Verify limit (4 restaurants)
  - Test links work
  - Check timestamps

### API Responses
- [ ] Google Places API
  - Search endpoints
  - Place details
  - Error handling

- [ ] OpenAI API
  - Review analysis
  - Response formatting
  - Error states

- [ ] Redis
  - Caching works
  - Recent restaurants update
  - Data persistence

### UI/UX
- [ ] Mobile Responsiveness
  - Test on different screen sizes
  - Check navigation
  - Verify touch interactions

- [ ] Loading States
  - Search loading
  - Analysis loading
  - Skeleton states

- [ ] Error Handling
  - Invalid searches
  - API failures
  - Network errors
  - Graceful fallbacks

## Environment Setup

### Local (.env.local)
