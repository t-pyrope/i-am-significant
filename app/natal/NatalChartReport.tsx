import type { NatalChart } from "@/app/types";
import { Box, Stack, Typography } from "@mui/material";
import { RULERS } from "./constants";
import { Points } from "./Points";
import secondHouseSigns from "@/app/docs/05-second-house-signs.json";
import secondHouseRulers from "@/app/docs/06-second-house-rulers.json";
import sixthHouseSigns from "@/app/docs/07-sixth-house-signs.json";
import sixthHouseRulers from "@/app/docs/08-sixth-house-rulers.json";
import { IntroText } from "@/app/natal/IntroText";
import { SecondHouseZodiac } from "@/app/natal/SecondHouseZodiac";
import { SecondHouseRuler } from "@/app/natal/SecondHouseRuler";
import { SixthHouseZodiac } from "@/app/natal/SixthHouseZodiac";
import { SixthHouseRuler } from "@/app/natal/SixthHouseRuler";

export function NatalChartReport({ chart }: { chart: NatalChart }) {
  const secondHouse = chart.houses.find((house) => house.house === 2);
  const sixthHouse = chart.houses.find((house) => house.house === 6);
  const secondSign = secondHouseSigns.find(
    (entry) => entry.sign_id === secondHouse?.sign_id,
  );
  const sixthSign = sixthHouseSigns.find(
    (entry) => entry.sign_id === sixthHouse?.sign_id,
  );

  if (!secondHouse || !sixthHouse || !secondSign || !sixthSign) return null;

  return (
    <>
      <IntroText />
      <SecondHouseZodiac secondSign={secondSign} />
      <SecondHouseRuler
        chart={chart}
        signId={secondHouse.sign_id}
        entries={secondHouseRulers.entries}
      />
      <SixthHouseZodiac sign={sixthSign} />
      <SixthHouseRuler signId={sixthHouse.sign_id} chart={chart} />
    </>
  );
}
