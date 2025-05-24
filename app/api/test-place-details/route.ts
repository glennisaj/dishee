import { NextResponse } from 'next/server';
import { getPlaceDetails } from '../../../utils/google-places';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('placeId');

  if (!placeId) {
    return NextResponse.json({ error: 'Missing placeId' }, { status: 400 });
  }

  try {
    const details = await getPlaceDetails(placeId);
    return NextResponse.json(details);
  } catch (error) {
    console.error('Error fetching place details:', error);
    return NextResponse.json({ error: 'Failed to fetch place details' }, { status: 500 });
  }
}
