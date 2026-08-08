export type RetrogradeValue = "true" | "false" | boolean;

export interface NatalBody {
  name: string;
  full_degree: number;
  norm_degree: number;
  speed: number;
  is_retro: RetrogradeValue;
  sign_id: number;
  sign: string;
  house: number;
}

export interface NatalHouse {
  house: number;
  sign: string;
  sign_id: number;
  degree: number;
}

export interface NatalAspect {
  aspecting_planet: string;
  aspected_planet: string;
  aspecting_planet_id: number;
  aspected_planet_id: number;
  aspect_type: number;
  type: string;
  orb: number;
  diff: number;
}

export interface NatalChart {
  planets: NatalBody[];
  houses: NatalHouse[];
  ascendant: number;
  midheaven: number;
  vertex: number;
  lilith?: NatalBody;
  aspects: NatalAspect[];
}

export function isNatalChart(value: unknown): value is NatalChart {
  if (!isRecord(value)) {
    return false;
  }

  return (
    Array.isArray(value.planets) &&
    value.planets.every(isNatalBody) &&
    Array.isArray(value.houses) &&
    value.houses.every(isNatalHouse) &&
    isNumber(value.ascendant) &&
    isNumber(value.midheaven) &&
    isNumber(value.vertex) &&
    (value.lilith === undefined || isNatalBody(value.lilith)) &&
    Array.isArray(value.aspects) &&
    value.aspects.every(isNatalAspect)
  );
}

export function formatDegree(value: number): string {
  const sign = value < 0 ? "-" : "";
  const absolute = Math.abs(value);
  let degrees = Math.floor(absolute);
  let minutes = Math.round((absolute - degrees) * 60);

  if (minutes === 60) {
    degrees += 1;
    minutes = 0;
  }

  return `${sign}${degrees}°${String(minutes).padStart(2, "0")}'`;
}

export function formatNumber(value: number): string {
  return Number.isInteger(value)
    ? value.toString()
    : value.toLocaleString("ru-RU", {
        maximumFractionDigits: 4,
      });
}

export function formatRetrograde(value: RetrogradeValue): string {
  return value === true || value === "true" ? "Ретроградная" : "Прямая";
}

function isNatalBody(value: unknown): value is NatalBody {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.name === "string" &&
    isNumber(value.full_degree) &&
    isNumber(value.norm_degree) &&
    isNumber(value.speed) &&
    isRetrogradeValue(value.is_retro) &&
    isNumber(value.sign_id) &&
    typeof value.sign === "string" &&
    isNumber(value.house)
  );
}

function isNatalHouse(value: unknown): value is NatalHouse {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNumber(value.house) &&
    typeof value.sign === "string" &&
    isNumber(value.sign_id) &&
    isNumber(value.degree)
  );
}

function isNatalAspect(value: unknown): value is NatalAspect {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.aspecting_planet === "string" &&
    typeof value.aspected_planet === "string" &&
    isNumber(value.aspecting_planet_id) &&
    isNumber(value.aspected_planet_id) &&
    isNumber(value.aspect_type) &&
    typeof value.type === "string" &&
    isNumber(value.orb) &&
    isNumber(value.diff)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isRetrogradeValue(value: unknown): value is RetrogradeValue {
  return value === true || value === false || value === "true" || value === "false";
}
