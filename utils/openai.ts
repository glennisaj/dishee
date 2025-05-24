import OpenAI from 'openai';
import { Review } from '@/types/api';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ReviewData {
  text: string;
  rating: number;
  time?: string;
}

interface DishAnalysis {
  name: string;
  rank: number;
  description: string;
  quote: string;
}

// Main analysis function (using the hybrid optimized prompt)
export async function analyzeDishesFromReviews(reviews: Review[]) {
  const reviewTexts = reviews.map(review => review.text).join('\n\n');

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `Analyze reviews and return exactly 3 most mentioned dishes.
        Rules:
        - Return only top 3 dishes by mention count
        - Use exactly 3 words for descriptions
        - Format: [Texture/Taste] [Main ingredient] [Standout]
        - Example: "Crispy tender chicken" or "Spicy melting beef"
        - Find specific, memorable quotes
        - Skip generic terms like "delicious" or "amazing"
        Return in JSON format.`
      },
      {
        role: "user",
        content: `Return top 3 dishes in this format:
        {
          "dishes": [
            {
              "name": "Dish Name",
              "description": "Three word description",
              "quote": "Most specific quote under 12 words",
              "mentions": number
            }
          ]
        }

        Reviews:
        ${reviewTexts}`
      }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('Empty response from OpenAI');
  }
  const parsedContent = JSON.parse(content);
  const dishes = parsedContent.dishes;

  return {
    dishes,
    tokenCount: response.usage?.total_tokens || 0
  };
}

// Concise Prompt
export async function analyzeDishesFromReviewsConcise(reviews: Review[]) {
  const reviewTexts = reviews.map(review => review.text).join('\n\n');

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `Analyze reviews for top dishes.
        Rules:
        - 5 word max descriptions
        - Format: [Main ingredient] + [key feature]
        - Use specific details
        Return in JSON format.`
      },
      {
        role: "user",
        content: `Return dishes in this format:
        {
          "dishes": [
            {
              "name": "Dish Name",
              "mentions": number,
              "description": "5-word description",
              "quote": "Brief customer quote"
            }
          ]
        }

        Reviews:
        ${reviewTexts}`
      }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('Empty response from OpenAI');
  }
  const parsedContent = JSON.parse(content);
  const dishes = parsedContent.dishes;

  return {
    dishes,
    tokenCount: response.usage?.total_tokens || 0
  };
}

// Ultra-Concise Prompt
export async function analyzeDishesFromReviewsUltraConcise(reviews: Review[]) {
  const reviewTexts = reviews.map(review => review.text).join('\n\n');

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `Find top dishes and best quotes.
        Rules:
        - 3 word descriptions
        - Focus on key features
        - Include memorable quote
        Return JSON format.`
      },
      {
        role: "user",
        content: `Return in format:
        {
          "dishes": [
            {
              "name": "Dish Name",
              "mentions": number,
              "description": "3-word highlight",
              "quote": "Best quote found"
            }
          ]
        }

        Reviews:
        ${reviewTexts}`
      }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('Empty response from OpenAI');
  }
  const parsedContent = JSON.parse(content);
  const dishes = parsedContent.dishes;

  return {
    dishes,
    tokenCount: response.usage?.total_tokens || 0
  };
}

// Hybrid Optimized Prompt (Limited to 3)
export async function analyzeDishesFromReviewsHybrid(reviews: Review[]) {
  const reviewTexts = reviews.map(review => review.text).join('\n\n');

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `Analyze reviews and return exactly 3 most mentioned dishes.
        Rules:
        - Return only top 3 dishes by mention count
        - Use exactly 3 words for descriptions
        - Format: [Texture/Taste] [Main ingredient] [Standout]
        - Example: "Crispy tender chicken" or "Spicy melting beef"
        - Find specific, memorable quotes
        - Skip generic terms like "delicious" or "amazing"
        Return in JSON format.`
      },
      {
        role: "user",
        content: `Return top 3 dishes in this format:
        {
          "dishes": [
            {
              "name": "Dish Name",
              "description": "Three word description",
              "quote": "Most specific quote under 12 words",
              "mentions": number
            }
          ]
        }

        Reviews:
        ${reviewTexts}`
      }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('Empty response from OpenAI');
  }
  const parsedContent = JSON.parse(content);
  const dishes = parsedContent.dishes;

  return {
    dishes,
    tokenCount: response.usage?.total_tokens || 0
  };
}