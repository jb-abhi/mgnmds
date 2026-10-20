export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};

export const onRequestGet: PagesFunction = async () => {
  const channelUrl = 'https://www.youtube.com/@m.g.nmotordrivingschoolkar9486/videos';

  try {
    const res = await fetch(channelUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!res.ok) {
      return Response.json(
        { error: 'Failed to fetch YouTube channel', status: res.status },
        {
          status: 502,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const html = await res.text();
    const match = html.match(/var ytInitialData = ({.*?});<\/script>/s);

    const videos: Array<{ title: string; url: string; videoId: string }> = [];
    const seen = new Set<string>();

    if (match) {
      try {
        const data = JSON.parse(match[1]) as {
          contents?: {
            twoColumnBrowseResultsRenderer?: {
              tabs?: Array<{
                tabRenderer?: {
                  title?: string;
                  selected?: boolean;
                  content?: {
                    richGridRenderer?: {
                      contents?: Array<{
                        richItemRenderer?: {
                          content?: {
                            lockupViewModel?: {
                              contentId?: string;
                              metadata?: {
                                lockupMetadataViewModel?: {
                                  title?: { content?: string };
                                };
                              };
                            };
                            videoRenderer?: {
                              videoId?: string;
                              title?: { runs?: Array<{ text?: string }> };
                            };
                          };
                        };
                      }>;
                    };
                  };
                };
              }>;
            };
          };
        };

        const tabs = data.contents?.twoColumnBrowseResultsRenderer?.tabs || [];
        const selTab =
          tabs.find((t) => t.tabRenderer?.selected) ||
          tabs.find((t) => t.tabRenderer?.title === 'Videos');
        const contents =
          selTab?.tabRenderer?.content?.richGridRenderer?.contents || [];

        for (const c of contents) {
          const l = c.richItemRenderer?.content?.lockupViewModel;
          const vr = c.richItemRenderer?.content?.videoRenderer;

          const videoId = l?.contentId || vr?.videoId;
          const title =
            l?.metadata?.lockupMetadataViewModel?.title?.content ||
            vr?.title?.runs?.[0]?.text;

          if (videoId && !seen.has(videoId)) {
            seen.add(videoId);
            videos.push({
              title: title || 'MGN Driving Lesson',
              url: `https://www.youtube.com/watch?v=${videoId}`,
              videoId,
            });
            if (videos.length >= 10) break;
          }
        }
      } catch {
        // Fallback to regex if JSON parse fails
      }
    }

    // Fallback regex matching if lockup extraction found nothing
    if (videos.length === 0) {
      const idMatches = html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g);
      for (const m of idMatches) {
        const id = m[1];
        if (!seen.has(id)) {
          seen.add(id);
          videos.push({
            title: 'MGN Driving Lesson & Training Video',
            url: `https://www.youtube.com/watch?v=${id}`,
            videoId: id,
          });
          if (videos.length >= 10) break;
        }
      }
    }

    return Response.json(
      {
        channel: '@m.g.nmotordrivingschoolkar9486',
        count: videos.length,
        videos,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    return Response.json(
      { error: 'Internal server error while fetching videos', details: String(error) },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
};
