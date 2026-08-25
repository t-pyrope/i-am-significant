import { ReportSection } from "@/app/natal/ReportSection";
import { Typography } from "@mui/material";

export const SecondHouseZodiac = ({
  secondSign,
}: {
  secondSign: {
    title: string;
    style: string;
    block: string;
    superpower: string;
  };
}) => {
  return (
    <ReportSection title="Куспид 2 дома — где лежат твои деньги?">
      <Typography component="h3" variant="h5" sx={{ mb: 1 }}>
        {secondSign.title}
      </Typography>
      <Typography component="p" sx={{ mb: 2 }}>
        <strong>Твой стиль:</strong> {secondSign.style}
      </Typography>
      <Typography component="p" sx={{ mb: 2 }}>
        <strong>Твой блок:</strong> {secondSign.block}
      </Typography>
      <Typography component="p">
        <strong>Твоя суперсила:</strong> {secondSign.superpower}
      </Typography>
    </ReportSection>
  );
};
