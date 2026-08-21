import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

import Button from "@mui/material/Button";
import { NATAL_STORAGE_KEY } from "@/app/natal/constants";
import { useRouter } from "next/navigation";
import { Logo } from "@/app/components/Logo";

export function Header() {
  const router = useRouter();
  const startAgain = () => {
    localStorage.removeItem(NATAL_STORAGE_KEY);
    router.replace("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Logo size={0.5} />

          <Button onClick={startAgain} variant="outlined">
            Начать сначала
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
