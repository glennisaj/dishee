import { NextResponse } from 'next/server';
import { getPlaceDetails } from '@/utils/google-places';
import { runPromptTest } from '@/utils/prompt-testing';

export async function POST(request: Request) {
  try {
    const { placeId } = await request.json();

    if (!placeId) {
      return NextResponse.json({ error: 'Place ID is required' }, { status: 400 });
    }

    const placeDetails = await getPlaceDetails(placeId, true);
    const testResults = await runPromptTest(placeDetails.reviews);

    return NextResponse.json({
      results: testResults,
      status: 'success'
    });

  } catch (error) {
    console.error('Prompt testing failed:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Testing failed',
      status: 'error'
    }, { status: 500 });
  }
}
