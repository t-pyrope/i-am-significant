import { ReportSection } from "@/app/natal/ReportSection";
import secondHouseRulers from "@/app/docs/06-second-house-rulers.json";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { Points } from "@/app/natal/Points";
import { RULERS } from "@/app/natal/constants";
import { NatalChart } from "@/app/types";

export const SecondHouseRuler = ({
  chart,
  signId,
  entries,
}: {
  chart: NatalChart;
  signId: number;
  entries: readonly { house: number }[];
}) => {
  const ruler = RULERS.find((item) => item.sign_id === signId);
  const planet = chart.planets.filter((planet) =>
    ruler?.rulers.includes(planet.name as never),
  )?.[0];
  const entry = entries.find(
    (item) => item.house === planet.house,
  ) as (typeof secondHouseRulers.entries)[number];

  return (
    <ReportSection title="Управитель твоего 2 дома">
      <Stack spacing={2}>
        {[
          "Ты уже знаешь свой стиль денег и свои блоки (что мешает повысить самооценку)",
          "А теперь самое интересное. То, ради чего ты сюда пришла.",
          "У каждого из нас есть природные таланты и навыки, записанные, это не то, чему тебя учили в школе. Это то, что ты умеешь легко, играючи, даже не задумываясь.",
          "Вопрос: Ты используешь эти дары в своей работе? Если да, деньги приходят легко и почти без усилий. Если нет, ты пытаешься заработать через чужое, неестественное для тебя действие, и деньги приходят с трудом.",
          "Этот дом показывает сферу жизни, где твои таланты раскрываются на 100%. Это планета, которая говорит: «Чтобы заработать, тебе нужно заниматься ВОТ ЭТИМ»",
        ].map((block) => (
          <Typography key={block} component="p" sx={{ whiteSpace: "pre-line" }}>
            {block}
          </Typography>
        ))}
      </Stack>

      {/*<Stack spacing={0}>*/}
      {/*  <Typography>К примеру:</Typography>*/}

      {/*  <List sx={{ listStyle: "decimal", pl: 4 }}>*/}
      {/*    {[*/}
      {/*      "При управителе 2 дома Овне деньги любят скорость, риск и твою личную инициативу",*/}
      {/*      "При тельцовской Венере - красоту, комфорт и материальные ценности",*/}
      {/*      "При Меркурии - информацию, общение и интеллект",*/}
      {/*      "С управителем Луной деньги любят заботу, эмоции и дом",*/}
      {/*      "С Солнцем - публичность, творчество и личное сияние",*/}
      {/*      "С управительницей Весов Венерой - партнерство, дипломатию и эстетику",*/}
      {/*      "С Плутоном - трансформацию, кризисы и большие риски",*/}
      {/*      "При Юпитере - масштаб, путешествия, обучение и удачу",*/}
      {/*      "С Сатурном - дисциплину, время, структуру и ответственность",*/}
      {/*      "При Уране - свободу, инновации, технологии и группы",*/}
      {/*      "С Нептуном деньги любят вдохновение, творчество, интуицию и закулисье",*/}
      {/*    ].map((block) => (*/}
      {/*      <ListItem sx={{ display: "list-item", p: 0 }} key={block}>*/}
      {/*        <ListItemText primary={block} />*/}
      {/*      </ListItem>*/}
      {/*    ))}*/}
      {/*  </List>*/}
      {/*</Stack>*/}

      <Box sx={{ mt: 3 }}>
        <Box key={`${planet.name}-${planet.house}`}>
          <Typography component="h3" variant="h5" sx={{ mb: 1 }}>
            Твой управитель 2 дома {planet.name} находится в {planet.house} доме
          </Typography>
          <Typography component="h4" sx={{ fontWeight: 700 }}>
            Твои природные таланты:
          </Typography>
          <Typography component="p" sx={{ mb: 2 }}>
            {entry?.natural_talents}
          </Typography>
          <Typography component="h4" sx={{ fontWeight: 700 }}>
            Что делать, чтобы заработать:
          </Typography>
          <Points points={entry?.what_to_do_to_earn} />
          <Typography component="h4" sx={{ fontWeight: 700 }}>
            Если ты еще не используешь это:
          </Typography>
          <Typography component="p">{entry?.if_not_using}</Typography>
        </Box>
      </Box>
    </ReportSection>
  );
};
