"use client";

import { useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import realisationWays from "@/app/docs/01-way-of-realisation.json";
import moneyWays from "@/app/docs/02-how-make-money.json";
import rulerWays from "@/app/docs/03-ruler.json";
import { RULERS } from "./constants";
import { getAscendantPlanetName } from "./utils";
import { isNatalChart, type NatalChart } from "./types";
import { useRouter } from "next/navigation";

const natalStorageKey = "natalChart";

export default function NatalPage() {
  const [chart, setChart] = useState<NatalChart | null>(null);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    queueMicrotask(() => {
      const savedNatalChart = localStorage.getItem(natalStorageKey);

      if (savedNatalChart) {
        try {
          const parsed: unknown = JSON.parse(savedNatalChart);

          if (isNatalChart(parsed)) {
            setChart(parsed);
          } else {
            localStorage.removeItem(natalStorageKey);
            router.replace("/");
          }
        } catch {
          localStorage.removeItem(natalStorageKey);
          router.replace("/");
        }
      } else {
        router.replace("/");
      }

      setHasCheckedStorage(true);
    });
  }, [router]);

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100svh",
        maxWidth: 800,
        mx: "auto",
        px: { xs: 3, sm: 4 },
        py: { xs: 4, sm: 6 },
      }}
    >
      {!hasCheckedStorage ? (
        <Typography color="text.secondary">
          Загружаем натальную карту...
        </Typography>
      ) : null}
      {hasCheckedStorage && chart ? <MoneyReport chart={chart} /> : null}
    </Box>
  );
}

function MoneyReport({ chart }: { chart: NatalChart }) {
  const router = useRouter();

  const solarSign = chart.planets.find((planet) => planet.name === "Солнце");
  const moonSign = chart.planets.find((planet) => planet.name === "Луна");
  const solarSignRuler = RULERS.find(
    (item) => item.sign_id === solarSign?.sign_id,
  );
  const realisationWaySign = realisationWays.find(
    (way) => way.sign_id === solarSignRuler?.sign_id,
  );
  const secondHouse = chart.houses.find((house) => house.house === 2);
  const moneyWaySign = moneyWays.find(
    (way) => way.sign_id === secondHouse?.sign_id,
  );
  const ruler = RULERS.find((item) => item.sign_id === secondHouse?.sign_id);
  const rulerPlanets = chart.planets.filter((planet) =>
    ruler?.rulers.includes(planet.name as never),
  );
  const rulerPlanetsWithWays = rulerPlanets
    .map((planet) => {
      const rulerWay = rulerWays.find((way) => way.house === planet.house);

      return rulerWay ? { ...planet, ...rulerWay } : null;
    })
    .filter((planet): planet is NonNullable<typeof planet> => planet !== null);

  const startAgain = () => {
    localStorage.removeItem(natalStorageKey);
    router.replace("/");
  };

  if (
    !solarSign ||
    !moonSign ||
    !realisationWaySign ||
    !secondHouse ||
    !moneyWaySign ||
    !ruler
  ) {
    return (
      <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
        <Typography color="text.secondary">
          В натальной карте не хватает данных для денежного разбора.
        </Typography>
        <Button onClick={startAgain} variant="contained">
          Попробовать еще раз
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={5}>
      <Box>
        <Typography
          component="h1"
          sx={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: { xs: "2.25rem", sm: "3rem" },
            fontWeight: 400,
          }}
        >
          {solarSign.sign}
        </Typography>
        <Typography>
          Асцендент: {getAscendantPlanetName(chart.houses)}
        </Typography>
        <Typography>Луна: {moonSign.sign}</Typography>
      </Box>

      <ReportSection title="Каким способом реализуется сфера денег?">
        <Typography component="h3" variant="h5" sx={{ mb: 1 }}>
          {solarSign.sign} — {realisationWaySign.title}
        </Typography>
        <Points points={realisationWaySign.realisation} />
        <Typography component="p" sx={{ fontWeight: 700, fontStyle: "italic" }}>
          Ключ: {realisationWaySign.key}
        </Typography>
      </ReportSection>

      <ReportSection title="Как ты зарабатываешь?">
        <Typography component="h3" variant="h5" sx={{ mb: 1 }}>
          2 дом {moneyWaySign.title}. Деньги приходят через
        </Typography>
        <Points points={moneyWaySign.points} />
        <Typography component="p" sx={{ fontWeight: 700, fontStyle: "italic" }}>
          Фраза: &quot;{moneyWaySign.key}&quot;
        </Typography>
      </ReportSection>

      <ReportSection title="Деньги через управителя 2 дома">
        <Stack spacing={3}>
          {rulerPlanetsWithWays.map((element) => (
            <Box key={`${element.name}-${element.house}`}>
              <Typography component="h3" variant="h5" sx={{ mb: 1 }}>
                Управитель {element.name} {element.title}
              </Typography>
              <Typography component="p">
                {element.way ? `${element.way}. ` : ""}Фразы:
              </Typography>
              <Points points={element.points} />
              <Typography
                component="p"
                sx={{ fontWeight: 700, fontStyle: "italic" }}
              >
                Пример: {element.example}
              </Typography>
            </Box>
          ))}

          <Box>
            <Button onClick={startAgain} variant="contained" color="error">
              Начать сначала
            </Button>
          </Box>
        </Stack>
      </ReportSection>

      <ReportSection title="Понравилась информация?">
        <Stack spacing={3}>
          <Typography>
            Узнай, как действовать, чтобы притянуть удачу в свою жизнь — в
            карьере и отношениях{" "}
            <span style={{ fontStyle: "italic" }}>(в разработке)</span>
          </Typography>
          <Button variant="contained">Заказать за 200 крон</Button>
        </Stack>
      </ReportSection>
    </Stack>
  );
}

function ReportSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box component="section">
      <Typography component="h2" variant="h4" sx={{ mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function Points({ points }: { points: string[] }) {
  return (
    <Box component="ul" sx={{ mt: 0, mb: 2, pl: 3 }}>
      {points.map((point) => (
        <li key={point}>{point}</li>
      ))}
    </Box>
  );
}
