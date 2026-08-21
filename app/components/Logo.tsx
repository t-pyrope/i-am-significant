import { Box, Typography } from "@mui/material";

export const Logo = ({ size = 1 }: { size?: number }) => {
  return (
    <Typography
      component="h1"
      variant="h1"
      sx={{
        color: "#CEB687",
        fontWeight: 400,
        lineHeight: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        component="span"
        sx={{
          display: "block",
          fontFamily: "var(--font-playfair-display), serif",
          fontSize: { xs: `calc(4.6rem * ${size})` },
          letterSpacing: "0.08em",
          lineHeight: 1,
        }}
      >
        NATALIA
      </Box>
      <Box
        component="span"
        sx={{
          display: "block",
          fontFamily: "var(--font-playfair-display), serif",
          fontSize: { xs: `calc(2rem * ${size})` },
          letterSpacing: "0.04em",
          lineHeight: 1.1,
          textTransform: "uppercase",
        }}
      >
        astro psychology
      </Box>
      <Box
        component="span"
        sx={{
          display: "block",
          fontFamily: "var(--font-pinyon-script), cursive",
          fontSize: { xs: `calc(2rem * ${size})` },
        }}
      >
        Prague
      </Box>
    </Typography>
  );
};
