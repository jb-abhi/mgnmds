interface ReviewsEnv {
  GOOGLE_PLACES_API_KEY?: string;
  GOOGLE_PLACE_ID?: string;
}

interface PlacesReview {
  rating?: number;
  text?: { text?: string };
  relativePublishTimeDescription?: string;
  authorAttribution?: {
    displayName?: string;
    photoUri?: string;
  };
}

interface PlaceResponse {
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  reviews?: PlacesReview[];
}

export const onRequestGet: PagesFunction<ReviewsEnv> = async ({ env }) => {
  const apiKey = env.GOOGLE_PLACES_API_KEY?.trim();
  const placeId = env.GOOGLE_PLACE_ID?.trim();

  if (!apiKey || !placeId) {
    return Response.json(
      { configured: false, message: 'Google reviews are not configured.' },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews',
        },
      },
    );

    if (!response.ok) {
      const status = response.status === 404 ? 404 : response.status === 429 ? 429 : 502;
      return Response.json(
        {
          configured: true,
          error: status === 404
            ? 'The configured Google Place ID was not found.'
            : status === 429
              ? 'Google reviews are temporarily rate limited.'
              : 'Google reviews are temporarily unavailable.',
        },
        { status },
      );
    }

    const place = await response.json() as PlaceResponse;
    const reviews = (Array.isArray(place.reviews) ? place.reviews : [])
      .filter((review) => (review.rating ?? 0) >= 4)
      .map((review) => ({
        name: review.authorAttribution?.displayName ?? 'Google Reviewer',
        rating: review.rating ?? 4,
        quote: review.text?.text ?? '',
        date: review.relativePublishTimeDescription ?? 'Recently',
        source: 'google' as const,
        authorPhoto: review.authorAttribution?.photoUri,
      }));

    return Response.json(
      {
        configured: true,
        placeName: place.displayName?.text,
        rating: place.rating,
        totalReviews: place.userRatingCount ?? reviews.length,
        reviews,
      },
      { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' } },
    );
  } catch {
    // Never include provider responses or request details in the public response/logs.
    return Response.json(
      { configured: true, error: 'Google reviews are temporarily unavailable.' },
      { status: 502 },
    );
  }
};
