import { Box } from "@mui/material";

export function Points({ points }: { points: string[] }) {
  return (
    <Box component="ul" sx={{ mt: 0, mb: 2, pl: 3 }}>
      {points.map((point) => (
        <li key={point}>{point}</li>
      ))}
    </Box>
  );
}
