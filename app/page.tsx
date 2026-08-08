"use client";

import { useEffect, useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useRouter } from "next/navigation";
import type { Dayjs } from "dayjs";

export default function Home() {
  const router = useRouter();
  const [birthDate, setBirthDate] = useState<Dayjs | null>(null);
  const [birthTime, setBirthTime] = useState<Dayjs | null>(null);
  const [birthCity, setBirthCity] = useState("");
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const city = birthCity.trim();

    if (!birthDate) {
      setError("Выберите дату рождения.");
      return;
    }

    if (!birthTime) {
      setError("Выберите время рождения.");
      return;
    }

    if (!city) {
      setError("Введите город рождения на английском.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const geoResponse = await postJson("/api/astrology/geo", { city });

      const natalResponse = await postJson("/api/astrology/natal", {
        birthDate: birthDate.format("YYYY-MM-DD"),
        birthTime: birthTime.format("HH:mm"),
        geoResponse,
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
            <Typography
              component="h1"
              sx={{
                color: "text.primary",
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: { xs: "2.45rem", sm: "3rem" },
                fontWeight: 400,
                lineHeight: 1.08,
              }}
            >
              i am significant
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                mt: 1.5,
                fontSize: "1rem",
                lineHeight: 1.6,
              }}
            >
              Введите дату рождения и город рождения на английском
            </Typography>
          </Box>

          <DatePicker
            label="Дата рождения"
            value={birthDate}
            onChange={(value) => setBirthDate(value)}
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

          <TextField
            fullWidth
            label="Город рождения (на английском)"
            placeholder="London"
            value={birthCity}
            onChange={(event) => setBirthCity(event.target.value)}
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
              borderRadius: 1,
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            {isSubmitting ? "Отправляем..." : "Узнать свой натал"}
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
