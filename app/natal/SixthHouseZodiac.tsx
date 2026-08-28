import { Box, Divider, Stack, Typography } from "@mui/material";
import { Points } from "@/app/natal/Points";
import { ReportSection } from "@/app/natal/ReportSection";

export const SixthHouseZodiac = ({
  sign,
}: {
  sign: {
    title: string;
    rhythm: string;
    team_style: string;
    money_opening_habits: string[];
    money_blocking_habits: string[];
    not_suitable: string[];
    if_not_using: string;
  };
}) => {
  return (
    <ReportSection title="6 дом — рабочий ритм">
      <Stack spacing={2}>
        {[
          "Но таланты это потенциал. Чтобы они превратились в реальные деньги, тебе нужно выстроить работу так, чтобы она не высасывала из тебя силы, а наполняла. Тебе нужно выстроить ежедневную работу, которая подходит именно тебе.",
          "Ты уже знаешь свой стиль, блоки которые удерживают твой уровень дохода, ты знаешь свои природные таланты, навыки, но это только потенциал, чтобы он превратился в реальные деньги, его нужно встроить в повседневную жизнь.",
          "Ты можешь быть гениальным блогером или иметь многообещающий бизнес, но если твой день начинается хаотично или ты работаешь против своего природного ритма, ты теряешь деньги и остается только усталость.",
          "За это отвечает куспид 6 дом. Это не про «карьеру» (за нее отвечает другой дом )- это твоя рабочая рутина, твои ежедневные привычки, твои отношения с коллегами и твой стиль выполнения задач.",
        ].map((block) => (
          <Typography key={block} component="p" sx={{ whiteSpace: "pre-line" }}>
            {block}
          </Typography>
        ))}
      </Stack>

      <Box sx={{ mt: 3 }}>
        <Typography component="h3" variant="h5" sx={{ mb: 1 }}>
          {sign.title}
        </Typography>
        <Typography component="p" sx={{ mb: 2 }}>
          <strong>Твой ритм:</strong> {sign.rhythm}
        </Typography>
        <Typography component="p" sx={{ mb: 2 }}>
          <strong>Твой стиль в команде:</strong> {sign.team_style}
        </Typography>
        <Typography component="h4" sx={{ fontWeight: 700 }}>
          Твои привычки, открывающие деньги:
        </Typography>
        <Points points={sign.money_opening_habits} />
        <Typography component="h4" sx={{ fontWeight: 700 }}>
          Твои привычки, блокирующие деньги:
        </Typography>
        <Points points={sign.money_blocking_habits} />
        <Typography component="h4" sx={{ fontWeight: 700 }}>
          Что тебе категорически не подходит:
        </Typography>
        <Points points={sign.not_suitable} />
        <Typography component="h4" sx={{ fontWeight: 700 }}>
          Что делать, если ты ещё не используешь это:
        </Typography>
        <Typography component="p">{sign.if_not_using}</Typography>
      </Box>

      <Divider sx={{ my: 3 }} />
      <Box>
        <Stack spacing={2}>
          {[
            "Ты узнала свой режим. Теперь ты знаешь, жаворонок ты или сова, любишь порядок или хаос, устаешь от людей или заряжаешься ими. Ты даже узнала, какие привычки открывают твой денежный поток, а какие перекрывают его, узнала себя?",
            "Но как превратить этот режим в ежедневный доход? Как сделать так, чтобы твой ритм работал на тебя, а не против тебя?",
            "За это отвечает управитель 6 дома.",
          ].map((block) => (
            <Typography
              key={block}
              component="p"
              sx={{ whiteSpace: "pre-line" }}
            >
              {block}
            </Typography>
          ))}
        </Stack>
      </Box>
    </ReportSection>
  );
};
