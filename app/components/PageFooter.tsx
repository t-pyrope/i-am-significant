import { Box } from "@mui/material";
import { SocialLinks } from "@/app/components/SocialLinks";

export const PageFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        py: 2,
        px: 3,
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <SocialLinks />
    </Box>
  );
};
