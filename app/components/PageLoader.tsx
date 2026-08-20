import { Box, CircularProgress } from "@mui/material";

export const PageLoader = () => {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        py: 6,
        bgcolor: "var(--background)",
      }}
    >
      <CircularProgress />
    </Box>
  );
};
