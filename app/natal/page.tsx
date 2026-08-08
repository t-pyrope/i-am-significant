"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  formatDegree,
  formatNumber,
  formatRetrograde,
  isNatalChart,
  type NatalAspect,
  type NatalBody,
  type NatalChart,
  type NatalHouse,
} from "./types";

const natalStorageKey = "natalChart";

export default function NatalPage() {
  const [chart, setChart] = useState<NatalChart | null>(null);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const savedNatalChart = localStorage.getItem(natalStorageKey);

      if (!savedNatalChart) {
        setHasCheckedStorage(true);
        return;
      }

      try {
        const parsed: unknown = JSON.parse(savedNatalChart);

        if (isNatalChart(parsed)) {
          setChart(parsed);
        } else {
          localStorage.removeItem(natalStorageKey);
        }
      } catch {
        localStorage.removeItem(natalStorageKey);
      } finally {
        setHasCheckedStorage(true);
      }
    });
  }, []);

  return (
    <Box sx={{ minHeight: "100svh", bgcolor: "var(--background)" }}>
      <Box
        component="header"
        sx={{
          borderBottom: "1px solid rgba(31, 26, 23, 0.14)",
          px: { xs: 3, sm: 4 },
          py: 2,
        }}
      >
        <Typography
          component="p"
          sx={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "1.2rem",
            color: "text.primary",
          }}
        >
          i am significant
        </Typography>
      </Box>

      <Box
        component="main"
        sx={{
          width: "100%",
          maxWidth: 1120,
          mx: "auto",
          px: { xs: 3, sm: 4 },
          py: { xs: 4, sm: 6 },
        }}
      >
        {!hasCheckedStorage ? <LoadingState /> : null}
        {hasCheckedStorage && !chart ? <UnavailableState /> : null}
        {hasCheckedStorage && chart ? <NatalChartContent chart={chart} /> : null}
      </Box>
    </Box>
  );
}

function LoadingState() {
  return (
    <Typography color="text.secondary" sx={{ fontSize: "1rem" }}>
      Загружаем натальную карту...
    </Typography>
  );
}

function UnavailableState() {
  return (
    <Stack spacing={3} sx={{ alignItems: "flex-start" }}>
      <Box>
        <Typography
          component="h1"
          sx={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: { xs: "2rem", sm: "2.6rem" },
            fontWeight: 400,
            lineHeight: 1.12,
          }}
        >
          Натальная карта недоступна
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.7 }}>
          Сохраненные данные не найдены. Вернитесь на главную страницу и
          рассчитайте карту заново.
        </Typography>
      </Box>
      <Button component={Link} href="/" variant="contained" disableElevation>
        Вернуться на главную
      </Button>
    </Stack>
  );
}

function NatalChartContent({ chart }: { chart: NatalChart }) {
  return (
    <Stack spacing={{ xs: 5, sm: 6 }}>
      <Box>
        <Typography
          component="h1"
          sx={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: { xs: "2.25rem", sm: "3rem" },
            fontWeight: 400,
            lineHeight: 1.08,
          }}
        >
          Натальная карта
        </Typography>
      </Box>

      <Section title="Обзор карты">
        <TableContainer sx={tableContainerSx}>
          <Table>
            <TableBody>
              <OverviewRow label="Ascendant" value={chart.ascendant} />
              <OverviewRow label="Midheaven / MC" value={chart.midheaven} />
              <OverviewRow label="Vertex" value={chart.vertex} />
            </TableBody>
          </Table>
        </TableContainer>
      </Section>

      <Section title="Планеты">
        <BodiesTable bodies={chart.planets} />
      </Section>

      <Section title="Дома">
        <HousesTable houses={chart.houses} />
      </Section>

      {chart.lilith ? (
        <Section title="Lilith">
          <BodiesTable bodies={[chart.lilith]} />
        </Section>
      ) : null}

      <Section title="Аспекты">
        <AspectsTable aspects={chart.aspects} />
      </Section>
    </Stack>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Box component="section">
      <Typography
        component="h2"
        sx={{
          mb: 2,
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: { xs: "1.5rem", sm: "1.8rem" },
          fontWeight: 400,
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function OverviewRow({ label, value }: { label: string; value: number }) {
  return (
    <TableRow>
      <TableCell sx={{ width: "40%", fontWeight: 600 }}>{label}</TableCell>
      <TableCell>{formatDegree(value)}</TableCell>
    </TableRow>
  );
}

function BodiesTable({ bodies }: { bodies: NatalBody[] }) {
  return (
    <TableContainer sx={tableContainerSx}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <HeadCell>Название</HeadCell>
            <HeadCell>Полный градус</HeadCell>
            <HeadCell>Градус в знаке</HeadCell>
            <HeadCell>ID знака</HeadCell>
            <HeadCell>Знак</HeadCell>
            <HeadCell>Дом</HeadCell>
            <HeadCell>Скорость</HeadCell>
            <HeadCell>Движение</HeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bodies.map((body) => (
            <TableRow key={`${body.name}-${body.full_degree}`}>
              <TableCell>{body.name}</TableCell>
              <TableCell>{formatDegree(body.full_degree)}</TableCell>
              <TableCell>{formatDegree(body.norm_degree)}</TableCell>
              <TableCell>{body.sign_id}</TableCell>
              <TableCell>{body.sign}</TableCell>
              <TableCell>{body.house}</TableCell>
              <TableCell>{formatNumber(body.speed)}</TableCell>
              <TableCell>{formatRetrograde(body.is_retro)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function HousesTable({ houses }: { houses: NatalHouse[] }) {
  return (
    <TableContainer sx={tableContainerSx}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <HeadCell>Дом</HeadCell>
            <HeadCell>Знак</HeadCell>
            <HeadCell>ID знака</HeadCell>
            <HeadCell>Градус</HeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {houses.map((house) => (
            <TableRow key={house.house}>
              <TableCell>{house.house}</TableCell>
              <TableCell>{house.sign}</TableCell>
              <TableCell>{house.sign_id}</TableCell>
              <TableCell>{formatDegree(house.degree)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function AspectsTable({ aspects }: { aspects: NatalAspect[] }) {
  return (
    <TableContainer sx={tableContainerSx}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <HeadCell>Планета</HeadCell>
            <HeadCell>ID</HeadCell>
            <HeadCell>Аспект</HeadCell>
            <HeadCell>Тип</HeadCell>
            <HeadCell>К планете</HeadCell>
            <HeadCell>ID</HeadCell>
            <HeadCell>Орб</HeadCell>
            <HeadCell>Разница</HeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {aspects.map((aspect, index) => (
            <TableRow
              key={`${aspect.aspecting_planet}-${aspect.aspected_planet}-${index}`}
            >
              <TableCell>{aspect.aspecting_planet}</TableCell>
              <TableCell>{aspect.aspecting_planet_id}</TableCell>
              <TableCell>{aspect.type}</TableCell>
              <TableCell>{aspect.aspect_type}</TableCell>
              <TableCell>{aspect.aspected_planet}</TableCell>
              <TableCell>{aspect.aspected_planet_id}</TableCell>
              <TableCell>{formatDegree(aspect.orb)}</TableCell>
              <TableCell>{formatDegree(aspect.diff)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function HeadCell({ children }: { children: ReactNode }) {
  return (
    <TableCell
      sx={{
        color: "text.secondary",
        fontSize: "0.78rem",
        fontWeight: 700,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </TableCell>
  );
}

const tableContainerSx = {
  border: "1px solid rgba(31, 26, 23, 0.14)",
  borderRadius: 1,
  overflowX: "auto",
  bgcolor: "rgba(255, 255, 255, 0.35)",
};
