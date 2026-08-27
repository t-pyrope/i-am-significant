"use client";

import { useEffect, useState } from "react";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
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
import { PageLoader } from "@/app/components/PageLoader";
import { Logo } from "@/app/components/Logo";
import { CitySuggestion } from "@/app/types";
import {
  getErrorMessage,
  isCitySuggestionsResponse,
  postJson,
} from "@/app/utils";
import { SocialLinks } from "@/app/components/SocialLinks";

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
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    try {
      const savedNatalChart = localStorage.getItem("natalChart");
      if (savedNatalChart) {
        JSON.parse(savedNatalChart);
        router.replace("/natal");
      }
    } catch {
      localStorage.removeItem("natalChart");
    } finally {
      setIsPageLoading(false);
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
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: -1,
            backgroundImage: "url('/bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        <Box
          component="main"
          sx={{
            minHeight: "100svh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 3,
            py: 6,
          }}
        >
          <Stack
            component="form"
            onSubmit={handleSubmit}
            spacing={3}
            sx={{
              width: "100%",
              maxWidth: 500,
              background:
                "linear-gradient(181deg, rgba(255, 255, 255, 0.04) 1.15%, rgba(255, 255, 255, 0.00) 98.91%)",
              px: { xs: 3, md: 4 },
              py: { xs: 2, md: 6 },
              backdropFilter: "blur(10px)",
              borderRadius: 5,
              position: "relative",
              //         "&::before": {
              //           position: "absolute",
              //           content: `""`,
              //           inset: 0,
              //           borderRadius: 5,
              //           padding: "1px",
              //           background: `linear-gradient(
              //         174deg,
              //         rgb(255, 255, 255, 0.05),
              //         rgba(255,255,255,0) 54%,
              //         rgba(252, 255, 255, 0.04)
              // )`,
              //           WebkitMask: `linear-gradient(#000 0 0) content-box,
              //         linear-gradient(#000 0 0)`,
              //           maskComposite: "xor",
              //           mixBlendMode: "overlay",
              //           pointerEvents: "none",
              //         },
            }}
          >
            <Box sx={{ textAlign: "center", mb: 1 }}>
              <Avatar
                alt="Natalia"
                src="/avatar.png"
                sx={{ width: 104, height: 104, mx: "auto", mb: 2.5 }}
              />
              <Logo size={0.7} />
              <Typography
                component="p"
                sx={{
                  mt: 2,
                  fontSize: "1rem",
                  lineHeight: 1.5,
                }}
              >
                Узнай, через что к тебе приходят деньги и какие способности
                помогут увеличить доход
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
              {isSubmitting ? "Отправляем..." : "Рассчитать"}
            </Button>

            {error ? (
              <Typography color="error" sx={{ textAlign: "center" }}>
                {error}
              </Typography>
            ) : null}

            <Divider />

            <SocialLinks />
          </Stack>
        </Box>
      </Box>

      {isPageLoading && <PageLoader />}
    </LocalizationProvider>
  );
}
