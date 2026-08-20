import { Box, Typography } from "@mui/material";

export function ReportSection({
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
