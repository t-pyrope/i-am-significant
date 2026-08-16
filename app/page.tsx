"use client";

import { useEffect, useState } from "react";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ruRU } from "@mui/x-date-pickers/locales";
import { useRouter } from "next/navigation";
import type { Dayjs } from "dayjs";
import "dayjs/locale/ru";

type CitySuggestion = {
  formatted: string;
  latitude: number;
  longitude: number;
  timezone?: {
    name: string;
  };
};

export default function Home() {
  const router = useRouter();
  const [birthDate, setBirthDate] = useState<Dayjs | null>(null);
  const [birthTime, setBirthTime] = useState<Dayjs | null>(null);
  const [birthCity, setBirthCity] = useState("");
  const [selectedCity, setSelectedCity] = useState<CitySuggestion | null>(null);
  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([]);
  const [isSearchingCities, setIsSearchingCities] = useState(false);
  const [citySearchError, setCitySearchError] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedNatalChart = localStorage.getItem("natalChart");

    if (!savedNatalChart) {
      return;
    }

    try {
      JSON.parse(savedNatalChart);
      router.push("/natal");
    } catch {
      localStorage.removeItem("natalChart");
    }
  }, [router]);

  useEffect(() => {
    const city = birthCity.trim();

    if (!city) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsSearchingCities(true);
      setCitySearchError("");

      try {
        const response = await fetch(
          `/api/geoapify/autocomplete?city=${encodeURIComponent(city)}`,
          { signal: controller.signal },
        );
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(getErrorMessage(data));
        }

        setCitySuggestions(isCitySuggestionsResponse(data) ? data.results : []);
      } catch (requestError) {
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return;
        }

        setCitySuggestions([]);
        setCitySearchError(
          requestError instanceof Error
            ? requestError.message
            : "Не удалось найти город.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsSearchingCities(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [birthCity]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!birthDate) {
      setError("Выбери дату рождения.");
      return;
    }

    if (!birthTime) {
      setError("Выбери время рождения.");
      return;
    }

    if (!selectedCity) {
      setError("Выбери город рождения из списка.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const natalResponse = await postJson("/api/astrology/natal", {
        birthDate: birthDate.format("YYYY-MM-DD"),
        birthTime: birthTime.format("HH:mm"),
        location: selectedCity,
      });

      localStorage.setItem("natalChart", JSON.stringify(natalResponse));
      router.push("/natal");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Не удалось отправить данные.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        component="main"
        sx={{
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
          py: 6,
          bgcolor: "var(--background)",
        }}
      >
        <Stack
          component="form"
          onSubmit={handleSubmit}
          spacing={3}
          sx={{
            width: "100%",
            maxWidth: 460,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 1 }}>
            <Avatar
              alt="Natalia"
              src="/avatar.jpg"
              sx={{ width: 104, height: 104, mx: "auto", mb: 2 }}
            />
            <Typography
              component="h1"
              sx={{
                color: "#CEB687",
                fontWeight: 400,
                lineHeight: 1,
              }}
            >
              <Box
                component="span"
                sx={{
                  display: "block",
                  fontFamily: "var(--font-playfair-display), serif",
                  fontSize: { xs: "4.6rem" },
                  letterSpacing: "0.08em",
                  lineHeight: 1,
                }}
              >
                NATALIA
              </Box>
              <Box
                component="span"
                sx={{
                  display: "block",
                  fontFamily: "var(--font-playfair-display), serif",
                  fontSize: { xs: "2rem" },
                  letterSpacing: "0.04em",
                  lineHeight: 1.1,
                  textTransform: "uppercase",
                }}
              >
                astro psychology
              </Box>
              <Box
                component="span"
                sx={{
                  display: "block",
                  fontFamily: "var(--font-pinyon-script), cursive",
                  fontSize: { xs: "2rem" },
                }}
              >
                Prague
              </Box>
            </Typography>
            <Typography
              component="p"
              sx={{
                mt: 1.5,
                fontSize: "1rem",
                lineHeight: 1.3,
              }}
            >
              Узнай, через что приходят деньги и какие способности помогут
              увеличить доход — индивидуально по твоей натальной карте
            </Typography>
          </Box>

          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="ru"
            localeText={
              ruRU.components.MuiLocalizationProvider.defaultProps.localeText
            }
          >
            <DatePicker
              label="Дата рождения"
              value={birthDate}
              onChange={(value) => setBirthDate(value)}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />

            <TimePicker
              label="Время рождения"
              value={birthTime}
              onChange={(value) => setBirthTime(value)}
              ampm={false}
              format="HH:mm"
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </LocalizationProvider>

          <Autocomplete<CitySuggestion, false, false, false>
            options={birthCity.trim() ? citySuggestions : []}
            value={selectedCity}
            inputValue={birthCity}
            loading={isSearchingCities}
            noOptionsText={
              citySearchError ||
              (birthCity.trim() ? "Города не найдены" : "Начни вводить город")
            }
            loadingText="Ищем города..."
            getOptionLabel={(option) => option.formatted}
            isOptionEqualToValue={(option, value) =>
              option.latitude === value.latitude &&
              option.longitude === value.longitude
            }
            onChange={(_event, city) => {
              setSelectedCity(city);
              setCitySearchError("");

              if (city) {
                setBirthCity(city.formatted);
              }
            }}
            onInputChange={(_event, value, reason) => {
              setBirthCity(value);

              if (reason === "input" || reason === "clear") {
                setSelectedCity(null);
              }

              if (!value.trim()) {
                setCitySuggestions([]);
                setCitySearchError("");
                setIsSearchingCities(false);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Город рождения"
                placeholder="Прага, Ташкент, Лондон"
                error={Boolean(citySearchError)}
                helperText={citySearchError}
                slotProps={{
                  ...params.slotProps,
                  input: {
                    ...params.slotProps.input,
                    endAdornment: (
                      <>
                        {isSearchingCities ? (
                          <CircularProgress size={20} />
                        ) : null}
                        {params.slotProps.input.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disableElevation
            disabled={isSubmitting}
            sx={{
              mt: 1,
              py: 1.35,
            }}
          >
            {isSubmitting ? "Отправляем..." : "Узнай свой натал"}
          </Button>

          {error ? (
            <Typography color="error" sx={{ textAlign: "center" }}>
              {error}
            </Typography>
          ) : null}
        </Stack>
      </Box>
    </LocalizationProvider>
  );
}

async function postJson(url: string, body: unknown) {
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

function getErrorMessage(data: unknown) {
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

function isCitySuggestionsResponse(
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
