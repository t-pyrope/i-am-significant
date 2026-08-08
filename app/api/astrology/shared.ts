import { find } from "geo-tz";

export const ASTROLOGY_API_BASE_URL = "https://json.astrologyapi.com/v1";

export type AstrologyApiError = {
  error: string;
  details?: unknown;
};

export type GeoLocation = {
  place_name?: unknown;
  latitude?: unknown;
  longitude?: unknown;
  timezone_id?: unknown;
  country_code?: unknown;
};

export function jsonError(
  message: string,
  status: number,
  details?: unknown,
): Response {
  return Response.json(
    {
      error: message,
      ...(details === undefined ? {} : { details }),
    } satisfies AstrologyApiError,
    { status },
  );
}

export function getAstrologyApiKey(): string | null {
  const apiKey = process.env.ASTROLOGY_API_KEY?.trim();
  return apiKey ? apiKey : null;
}

export function astrologyHeaders(apiKey: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    "Accept-Language": "ru",
    "x-astrologyapi-key": apiKey,
  };
}

export async function parseJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function getFirstGeoLocation(value: unknown): GeoLocation | null {
  if (
    typeof value !== "object" ||
    value === null ||
    !("geonames" in value) ||
    !Array.isArray(value.geonames) ||
    value.geonames.length === 0
  ) {
    return null;
  }

  const [location] = value.geonames;
  return typeof location === "object" && location !== null ? location : null;
}

export function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function getTimeZoneId(location: GeoLocation, lat: number, lon: number) {
  if (typeof location.timezone_id === "string" && location.timezone_id.trim()) {
    return location.timezone_id.trim();
  }

  const [timeZoneId] = find(lat, lon);
  return timeZoneId ?? null;
}

export function getUtcOffsetHoursForLocalTime({
  timeZone,
  year,
  month,
  day,
  hour,
  minute,
}: {
  timeZone: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}): number {
  const localAsUtcMs = Date.UTC(year, month - 1, day, hour, minute);
  let utcMs = localAsUtcMs;

  for (let iteration = 0; iteration < 3; iteration += 1) {
    const offsetMinutes = getUtcOffsetMinutes(timeZone, new Date(utcMs));
    const nextUtcMs = localAsUtcMs - offsetMinutes * 60_000;

    if (nextUtcMs === utcMs) {
      break;
    }

    utcMs = nextUtcMs;
  }

  const offsetMinutes = getUtcOffsetMinutes(timeZone, new Date(utcMs));
  return Number((offsetMinutes / 60).toFixed(2));
}

function getUtcOffsetMinutes(timeZone: string, date: Date): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    calendar: "gregory",
    numberingSystem: "latn",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date).reduce<Record<string, string>>(
    (result, part) => {
      if (part.type !== "literal") {
        result[part.type] = part.value;
      }

      return result;
    },
    {},
  );

  const zonedAsUtcMs = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );

  return Math.round((zonedAsUtcMs - date.getTime()) / 60_000);
}
