interface ReviewsEnv {
  GOOGLE_PLACES_API_KEY?: string;
  GOOGLE_PLACE_ID?: string;
}

interface NewPlaceReview {
  rating?: number;
  text?: { text?: string };
  relativePublishTimeDescription?: string;
  authorAttribution?: {
    displayName?: string;
    photoUri?: string;
    uri?: string;
  };
  googleMapsUri?: string;
}

export const onRequestGet: PagesFunction<ReviewsEnv> = async ({ env }) => {
  const apiKey = env.GOOGLE_PLACES_API_KEY?.trim().replace(/;$/, '');
  const placeId = env.GOOGLE_PLACE_ID?.trim().replace(/;$/, '');

  if (!apiKey || !placeId) {
    return Response.json({
      configured: false,
      message: 'Google Places API key or Place ID not configured.',
    });
  }

  try {
    // 1. Preferred modern endpoint: Google Places API (New)
    const newApiUrl = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;
    const newRes = await fetch(newApiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,reviews',
      },
    });

    if (newRes.ok) {
      const data = (await newRes.json()) as {
        rating?: number;
        userRatingCount?: number;
        reviews?: NewPlaceReview[];
      };

      const rawReviews = data.reviews ?? [];
      // Filter strictly for ratings 4 stars and above
      const reviews = rawReviews
        .filter((r) => (r.rating ?? 0) >= 4)
        .map((r) => ({
          name: r.authorAttribution?.displayName ?? 'Google Reviewer',
          rating: r.rating ?? 5,
          quote: r.text?.text ?? '',
          date: r.relativePublishTimeDescription ?? 'Recently',
          source: 'google' as const,
          authorPhoto: r.authorAttribution?.photoUri,
        }));

      return Response.json(
        {
          configured: true,
          rating: data.rating ?? 4.8,
          totalReviews: data.userRatingCount ?? reviews.length,
          reviews,
        },
        {
          headers: {
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          },
        }
      );
    }

    // 2. Fallback endpoint: Legacy Places API
    const legacyUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      placeId
    )}&fields=name,rating,reviews,user_ratings_total&key=${encodeURIComponent(apiKey)}`;
    const legacyRes = await fetch(legacyUrl);

    if (legacyRes.ok) {
      const data = (await legacyRes.json()) as {
        result?: {
          rating?: number;
          user_ratings_total?: number;
          reviews?: Array<{
            author_name: string;
            rating: number;
            text: string;
            relative_time_description?: string;
            profile_photo_url?: string;
          }>;
        };
        status?: string;
      };

      if (data.status === 'OK' && data.result) {
        const rawReviews = data.result.reviews ?? [];
        const reviews = rawReviews
          .filter((r) => (r.rating ?? 0) >= 4)
          .map((r) => ({
            name: r.author_name,
            rating: r.rating,
            quote: r.text,
            date: r.relative_time_description ?? 'Recently',
            source: 'google' as const,
            authorPhoto: r.profile_photo_url,
          }));

        return Response.json(
          {
            configured: true,
            rating: data.result.rating ?? 4.8,
            totalReviews: data.result.user_ratings_total ?? reviews.length,
            reviews,
          },
          {
            headers: {
              'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            },
          }
        );
      }
    }

    return Response.json(
      { configured: true, error: 'Could not fetch reviews from Google Places API.' },
      { status: 502 }
    );
  } catch (err) {
    return Response.json(
      { configured: true, error: String(err) },
      { status: 500 }
    );
  }
};
