import {
  jsonError,
  parseJsonResponse,
  toFiniteNumber,
} from "../../astrology/shared";

export const runtime = "nodejs";

type GeoapifyProperties = {
  formatted?: unknown;
  lat?: unknown;
  lon?: unknown;
  timezone?:
    | {
        name?: unknown;
      }
    | unknown;
};

type GeoapifyFeature = {
  properties?: GeoapifyProperties;
};

export type CitySuggestion = {
  formatted: string;
  latitude: number;
  longitude: number;
  timezone?: {
    name: string;
  };
};

export async function GET(request: Request) {
  const city = new URL(request.url).searchParams.get("city")?.trim() ?? "";

  if (!city) {
    return jsonError("City is required.", 400);
  }

  const apiKey = process.env.GEOAPIFY_KEY?.trim();

  if (!apiKey) {
    return jsonError("GEOAPIFY_KEY is not configured.", 500);
  }

  const url = new URL("https://api.geoapify.com/v1/geocode/autocomplete");
  url.searchParams.set("text", city);
  url.searchParams.set("type", "city");
  url.searchParams.set("limit", "5");
  url.searchParams.set("lang", "ru");
  url.searchParams.set("apiKey", apiKey);

  let geoapifyResponse: Response;

  try {
    geoapifyResponse = await fetch(url);
  } catch {
    return jsonError("Geoapify request failed.", 502);
  }

  const payload = await parseJsonResponse(geoapifyResponse);

  if (!geoapifyResponse.ok) {
    return jsonError("Geoapify request failed.", geoapifyResponse.status, {
      status: geoapifyResponse.status,
      response: payload,
    });
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    !("features" in payload) ||
    !Array.isArray(payload.features)
  ) {
    return jsonError("Geoapify response is invalid.", 502, payload);
  }

  const results = payload.features
    .map(toCitySuggestion)
    .filter((result): result is CitySuggestion => result !== null);

  return Response.json({ results });
}

function toCitySuggestion(feature: unknown): CitySuggestion | null {
  const properties = (feature as GeoapifyFeature)?.properties;
  const latitude = toFiniteNumber(properties?.lat);
  const longitude = toFiniteNumber(properties?.lon);

  if (
    typeof properties?.formatted !== "string" ||
    !properties.formatted.trim() ||
    latitude === null ||
    longitude === null
  ) {
    return null;
  }

  const timezoneName =
    typeof properties.timezone === "object" &&
    properties.timezone !== null &&
    "name" in properties.timezone &&
    typeof properties.timezone.name === "string" &&
    properties.timezone.name.trim()
      ? properties.timezone.name.trim()
      : undefined;

  return {
    formatted: properties.formatted.trim(),
    latitude,
    longitude,
    ...(timezoneName ? { timezone: { name: timezoneName } } : {}),
  };
}
