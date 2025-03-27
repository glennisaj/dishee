import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Review {
  text: string;
  rating: number;
}

interface DishAnalysis {
  name: string;
  rank: number;
  description: string;
  quote: string;
}

export async function analyzeDishesFromReviews(reviews: Review[]): Promise<DishAnalysis[]> {
  try {
    const reviewTexts = reviews.map(review => `Rating: ${review.rating}/5\nReview: ${review.text}`).join('\n\n');

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a sophisticated restaurant critic who analyzes reviews to identify and describe the top 3 most positively mentioned dishes. 
          For each dish, create an engaging description based on review patterns and select the most compelling customer quote.
          Focus on specific dishes, not general categories like 'food' or 'dessert'.`
        },
        {
          role: "user",
          content: `Analyze these restaurant reviews and identify the top 3 most recommended dishes. 
          For each dish, provide:
          1. A descriptive name
          2. An enticing description that captures the dish's highlights from multiple reviews
          3. The best customer quote that showcases the dish's appeal

          Reviews to analyze:
          ${reviewTexts}

          Return the analysis in this exact JSON format:
          {
            "dishes": [
              {
                "name": "Dish Name",
                "rank": 1,
                "description": "Compelling description of the dish based on review analysis",
                "quote": "Best actual customer quote about this dish"
              }
            ]
          }`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.dishes;
  } catch (error) {
    console.error('Error analyzing reviews:', error);
    throw error;
  }
}
