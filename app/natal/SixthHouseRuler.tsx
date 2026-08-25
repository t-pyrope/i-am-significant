import { ReportSection } from "@/app/natal/ReportSection";
import { Typography } from "@mui/material";
import { Points } from "@/app/natal/Points";
import { RULERS } from "@/app/natal/constants";
import { NatalChart } from "@/app/types";
import sixthHouseRulers from "@/app/docs/08-sixth-house-rulers.json";

export const SixthHouseRuler = ({
  signId,
  chart,
}: {
  signId: number;
  chart: NatalChart;
}) => {
  const ruler = RULERS.find((item) => item.sign_id === signId);
  const planet = chart.planets.filter((planet) =>
    ruler?.rulers.includes(planet.name as never),
  )?.[0];
  const entry = sixthHouseRulers.find((item) => item.house === planet.house);

  return (
    <ReportSection title="Управитель 6 дома">
      <Typography component="h3" variant="h5" sx={{ mb: 1 }}>
        Твой управитель 6 дома {planet.name} находится в {planet.house} доме
      </Typography>
      <Typography component="h4" sx={{ fontWeight: 700 }}>
        Твой ежедневный двигатель:
      </Typography>
      <Typography component="p" sx={{ mb: 2 }}>
        {entry?.daily_engine}
      </Typography>
      <Typography component="h4" sx={{ fontWeight: 700 }}>
        Что делать, чтобы деньги шли каждый день:
      </Typography>
      <Points points={entry?.what_to_do_for_daily_income ?? []} />
      <Typography component="h4" sx={{ fontWeight: 700 }}>
        Если ты не используешь это:
      </Typography>
      <Typography component="p">{entry?.if_not_using}</Typography>
    </ReportSection>
  );
};
