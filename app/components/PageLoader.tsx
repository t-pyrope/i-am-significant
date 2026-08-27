import { Box, CircularProgress } from "@mui/material";

export const PageLoader = () => {
  return (
    <Box
      role="status"
      aria-label="Загрузка"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "var(--background)",
      }}
    >
      <CircularProgress />
    </Box>
  );
};
