import {
  ASTROLOGY_API_BASE_URL,
  astrologyHeaders,
  getAstrologyApiKey,
  jsonError,
  parseJsonResponse,
} from "../shared";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const apiKey = getAstrologyApiKey();

  if (!apiKey) {
    return jsonError("ASTROLOGY_API_KEY is not configured.", 500);
  }

  const body = await request.json().catch(() => null);
  const city = typeof body?.city === "string" ? body.city.trim() : "";

  if (!city) {
    return jsonError("City is required.", 400);
  }

  const astrologyResponse = await fetch(
    `${ASTROLOGY_API_BASE_URL}/geo_details`,
    {
      method: "POST",
      headers: astrologyHeaders(apiKey),
      body: JSON.stringify({
        place: city,
        maxRows: 5,
      }),
    },
  );

  const geoResponse = await parseJsonResponse(astrologyResponse);

  console.log("=== AstrologyAPI GEO RESPONSE ===");
  console.log(JSON.stringify(geoResponse, null, 2));

  if (!astrologyResponse.ok) {
    return jsonError("AstrologyAPI geo request failed.", astrologyResponse.status, {
      status: astrologyResponse.status,
      response: geoResponse,
    });
  }

  if (
    typeof geoResponse !== "object" ||
    geoResponse === null ||
    !("geonames" in geoResponse) ||
    !Array.isArray(geoResponse.geonames)
  ) {
    return jsonError("AstrologyAPI geo response is invalid.", 502, geoResponse);
  }

  if (geoResponse.geonames.length === 0) {
    return jsonError("No matching city found.", 404, geoResponse);
  }

  return Response.json(geoResponse);
}
