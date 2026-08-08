import {
  ASTROLOGY_API_BASE_URL,
  astrologyHeaders,
  getAstrologyApiKey,
  getFirstGeoLocation,
  getTimeZoneId,
  getUtcOffsetHoursForLocalTime,
  jsonError,
  parseJsonResponse,
  toFiniteNumber,
} from "../shared";

export const runtime = "nodejs";

type BirthPayload = {
  birthDate?: unknown;
  birthTime?: unknown;
  geoResponse?: unknown;
};

export async function POST(request: Request) {
  const apiKey = getAstrologyApiKey();

  if (!apiKey) {
    return jsonError("ASTROLOGY_API_KEY is not configured.", 500);
  }

  const body = (await request.json().catch(() => null)) as BirthPayload | null;

  if (!body || typeof body.birthDate !== "string") {
    return jsonError("Birth date is required.", 400);
  }

  if (!body || typeof body.birthTime !== "string") {
    return jsonError("Birth time is required.", 400);
  }

  const location = getFirstGeoLocation(body.geoResponse);

  if (!location) {
    return jsonError("No matching city found.", 400);
  }

  const lat = toFiniteNumber(location.latitude);
  const lon = toFiniteNumber(location.longitude);

  if (lat === null) {
    return jsonError("Selected city is missing latitude.", 400, location);
  }

  if (lon === null) {
    return jsonError("Selected city is missing longitude.", 400, location);
  }

  const dateParts = parseDateParts(body.birthDate);
  const timeParts = parseTimeParts(body.birthTime);

  if (!dateParts) {
    return jsonError("Birth date is invalid.", 400);
  }

  if (!timeParts) {
    return jsonError("Birth time is invalid.", 400);
  }

  const timeZone = getTimeZoneId(location, lat, lon);

  if (!timeZone) {
    return jsonError("Selected city is missing timezone.", 400, location);
  }

  let tzone: number;

  try {
    tzone = getUtcOffsetHoursForLocalTime({
      timeZone,
      ...dateParts,
      ...timeParts,
    });
  } catch (error) {
    return jsonError("Could not resolve timezone offset.", 400, {
      timeZone,
      error: error instanceof Error ? error.message : error,
    });
  }

  const natalRequest = {
    day: dateParts.day,
    month: dateParts.month,
    year: dateParts.year,
    hour: timeParts.hour,
    min: timeParts.minute,
    lat,
    lon,
    tzone,
    house_type: "placidus",
    is_asteroids: false,
  };

  console.log("=== NORMALIZED NATAL REQUEST DATA ===");
  console.log(
    JSON.stringify(
      {
        ...natalRequest,
        place: location.place_name,
        country_code: location.country_code,
        timezone_id: timeZone,
      },
      null,
      2,
    ),
  );

  const astrologyResponse = await fetch(
    `${ASTROLOGY_API_BASE_URL}/western_horoscope`,
    {
      method: "POST",
      headers: astrologyHeaders(apiKey),
      body: JSON.stringify(natalRequest),
    },
  );

  const natalResponse = await parseJsonResponse(astrologyResponse);

  console.log("=== AstrologyAPI NATAL RESPONSE ===");
  console.log(JSON.stringify(natalResponse, null, 2));

  if (!astrologyResponse.ok) {
    return jsonError(
      "AstrologyAPI natal request failed.",
      astrologyResponse.status,
      {
        status: astrologyResponse.status,
        response: natalResponse,
      },
    );
  }

  if (typeof natalResponse !== "object" || natalResponse === null) {
    return jsonError("AstrologyAPI natal response is invalid.", 502, natalResponse);
  }

  return Response.json(natalResponse);
}

function parseDateParts(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const [, year, month, day] = match.map(Number);

  if (!year || month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  if (
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !== month - 1 ||
    parsedDate.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

function parseTimeParts(value: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const [, hour, minute] = match.map(Number);

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }

  return { hour, minute };
}
