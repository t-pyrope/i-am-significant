import { CitySuggestion } from "@/app/types";

export function isCitySuggestionsResponse(
  data: unknown,
): data is { results: CitySuggestion[] } {
  return (
    typeof data === "object" &&
    data !== null &&
    "results" in data &&
    Array.isArray(data.results) &&
    data.results.every(
      (result) =>
        typeof result === "object" &&
        result !== null &&
        "formatted" in result &&
        typeof result.formatted === "string" &&
        "latitude" in result &&
        typeof result.latitude === "number" &&
        "longitude" in result &&
        typeof result.longitude === "number",
    )
  );
}

export async function postJson(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  return data;
}

export function getErrorMessage(data: unknown) {
  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "string"
  ) {
    return data.error;
  }

  return "Не удалось отправить данные.";
}
