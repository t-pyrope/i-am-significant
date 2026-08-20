import type { NatalChart } from "@/app/natal/types";
import { useRouter } from "next/navigation";
import { NATAL_STORAGE_KEY, RULERS } from "@/app/natal/constants";
import realisationWays from "@/app/docs/01-way-of-realisation.json";
import moneyWays from "@/app/docs/02-how-make-money.json";
import rulerWays from "@/app/docs/03-ruler.json";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import {
  getAscendantPlanetName,
  getNominativeCase,
  getPrepositionalCase,
  getZodiacSymbolImageSrc,
} from "@/app/natal/utils";
import { ReportSection } from "./ReportSection";
import { Points } from "./Points";

export function MoneyReport({ chart }: { chart: NatalChart }) {
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
    localStorage.removeItem(NATAL_STORAGE_KEY);
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

  const iconSrc = getZodiacSymbolImageSrc(solarSign.sign_id);
  const solarSignPrepositional = getPrepositionalCase(solarSign.sign);
  const ascendantName = getAscendantPlanetName(chart.houses);
  const ascendantPrepositional = getPrepositionalCase(ascendantName);
  const moonPrepositional = getPrepositionalCase(moonSign.sign);

  const solarNominative = getNominativeCase(solarSign.sign);

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
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: { xs: "2.25rem", sm: "3rem" },
                fontWeight: 400,
                mb: 1,
              }}
            >
              Солнце в {solarSignPrepositional}
            </Typography>
            <Typography>Асцендент в {ascendantPrepositional}</Typography>
            <Typography>Луна в {moonPrepositional}</Typography>
          </Box>
        </Box>
      </Box>

      <ReportSection title="Каким способом реализуется сфера денег?">
        <Typography component="h3" variant="h5" sx={{ mb: 1 }}>
          {solarNominative} — {realisationWaySign.title}
        </Typography>
        <Points points={realisationWaySign.realisation} />
        <Typography component="p" sx={{ fontWeight: 700, fontStyle: "italic" }}>
          Ключ: {realisationWaySign.key}
        </Typography>
      </ReportSection>

      <ReportSection title="Как ты зарабатываешь?">
        <Typography component="h3" variant="h5" sx={{ mb: 1 }}>
          Твой 2 дом {moneyWaySign.title}. Это значит, что деньги приходят
          через:
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
                Управитель 2 дома {element.name} стоит в {element.title}
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
            Закажи более подробную информацию с учетом аспектов и положения
            других планет и домов в твоей натальной карте{" "}
            <span style={{ fontStyle: "italic" }}>(в разработке)</span>
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button variant="contained">Заказать за 300 крон</Button>
            <Typography>или</Typography>
            <Button variant="contained">Записывайся на консультацию</Button>
          </Box>
        </Stack>
      </ReportSection>
    </Stack>
  );
}
