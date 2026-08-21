import { Box, Button } from "@mui/material";
import { useState } from "react";
import { AppModal } from "@/app/components/AppModal";

export const OrderModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Заказать за 300 крон
      </Button>

      <AppModal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: "stretch" }}>В разработке</Box>
      </AppModal>
    </Box>
  );
};
