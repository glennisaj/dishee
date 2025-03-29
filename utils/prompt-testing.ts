import { 
  analyzeDishesFromReviews,
  analyzeDishesFromReviewsHybrid
} from './openai'
import { Review, DishAnalysis } from '@/types/api'

interface PromptTestResult {
  name: string;
  latency: number;
  tokenCount: number;
  results: DishAnalysis[];
}

interface PromptTest {
  name: string;
  startTime: number;
  endTime: number;
  tokenCount: number;
  results: DishAnalysis[] | null;
}

export async function runPromptTest(reviews: Review[]): Promise<PromptTestResult[]> {
  const tests: PromptTest[] = [];
  
  // Test Original Prompt
  const originalTest = {
    name: 'Original Prompt',
    startTime: Date.now(),
    results: null,
    tokenCount: 0,
    endTime: 0
  };

  try {
    const originalResults = await analyzeDishesFromReviews(reviews);
    originalTest.results = originalResults.dishes;
    originalTest.tokenCount = originalResults.tokenCount;
    originalTest.endTime = Date.now();
    tests.push(originalTest);
  } catch (error) {
    console.error('Original prompt test failed:', error);
  }

  // Test Hybrid Prompt
  const hybridTest = {
    name: 'Hybrid Optimized Prompt',
    startTime: Date.now(),
    results: null,
    tokenCount: 0,
    endTime: 0
  };

  try {
    const hybridResults = await analyzeDishesFromReviewsHybrid(reviews);
    hybridTest.results = hybridResults.dishes;
    hybridTest.tokenCount = hybridResults.tokenCount;
    hybridTest.endTime = Date.now();
    tests.push(hybridTest);
  } catch (error) {
    console.error('Hybrid prompt test failed:', error);
  }

  return tests.map(test => ({
    name: test.name,
    latency: test.endTime - test.startTime,
    tokenCount: test.tokenCount,
    results: test.results || []
  }));
}
