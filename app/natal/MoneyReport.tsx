import type { NatalChart } from "@/app/types";
import { useRouter } from "next/navigation";
import { NATAL_STORAGE_KEY } from "@/app/natal/constants";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import {
  getAscendantPlanetName,
  getPrepositionalCase,
  getZodiacSymbolImageSrc,
} from "@/app/natal/utils";
import { ChartModal } from "@/app/components/ChartModal";
import { NatalChartReport } from "./NatalChartReport";
// import { OrderModal } from "@/app/components/OrderModal";

export function MoneyReport({ chart }: { chart: NatalChart }) {
  const router = useRouter();

  const solarSign = chart.planets.find((planet) => planet.name === "Солнце");
  const moonSign = chart.planets.find((planet) => planet.name === "Луна");

  const startAgain = () => {
    localStorage.removeItem(NATAL_STORAGE_KEY);
    router.replace("/");
  };

  if (
    !solarSign ||
    !moonSign ||
    !chart.houses.some((house) => house.house === 2) ||
    !chart.houses.some((house) => house.house === 6)
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

  const iconSrc = getZodiacSymbolImageSrc(solarSign.sign_id);
  const solarSignPrepositional = getPrepositionalCase(solarSign.sign);
  const ascendantName = getAscendantPlanetName(chart.houses);
  const ascendantPrepositional = getPrepositionalCase(ascendantName);
  const moonPrepositional = getPrepositionalCase(moonSign.sign);

  return (
    <Stack spacing={5}>
      <Box>
        <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
          <Avatar
            alt="Символ знака"
            src={iconSrc}
            sx={{
              width: 110,
              height: 110,
              border: "1px solid gray",
            }}
          />
          <Box>
            <Typography
              component="h1"
              variant="h1"
              sx={{
                fontSize: { xs: "2.25rem", sm: "3rem" },
                mb: 1,
              }}
            >
              Солнце в {solarSignPrepositional}
            </Typography>
            <Typography>Асцендент в {ascendantPrepositional}</Typography>
            <Typography sx={{ mb: 1 }}>Луна в {moonPrepositional}</Typography>
            <ChartModal planets={chart.planets} houses={chart.houses} />
          </Box>
        </Box>
      </Box>

      <NatalChartReport chart={chart} />

      {/*<ReportSection title="">*/}
      {/*  <Stack spacing={3}>*/}
      {/*    <Typography>*/}
      {/*      Закажи более подробную информацию с учетом положения планет и их*/}
      {/*      аспектов в твоей натальной карте{" "}*/}
      {/*      <span style={{ fontStyle: "italic" }}>(в разработке)</span>*/}
      {/*    </Typography>*/}
      {/*    <OrderModal />*/}
      {/*    <Box>*/}
      {/*      <Button*/}
      {/*        variant="outlined"*/}
      {/*        target="_blank"*/}
      {/*        href="https://www.instagram.com/natalia_fedotova_/"*/}
      {/*      >*/}
      {/*        Записывайся на консультацию*/}
      {/*      </Button>*/}
      {/*    </Box>*/}
      {/*  </Stack>*/}
      {/*</ReportSection>*/}
    </Stack>
  );
}
