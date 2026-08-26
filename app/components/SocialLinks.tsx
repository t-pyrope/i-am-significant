import { Box, IconButton } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";

export const SocialLinks = () => {
  return (
    <Box sx={{ display: "flex", gap: 0.3, justifyContent: "center" }}>
      <IconButton
        component="a"
        href="https://www.instagram.com/natalia_fedotova_/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        color="primary"
      >
        <InstagramIcon />
      </IconButton>

      <IconButton
        component="a"
        href="https://t.me/Natalia_Fedotovaa"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Telegram"
        color="primary"
      >
        <TelegramIcon />
      </IconButton>
    </Box>
  );
};
