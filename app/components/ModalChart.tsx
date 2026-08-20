import { NatalChartProps } from "@/app/types";
import { Chart } from "@/app/components/Chart";
import { Box, Button, Modal } from "@mui/material";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  maxWidth: "calc(100vw - 20px)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
};

export function ModalChart(props: NatalChartProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Открыть натал
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Button variant="outlined" onClick={() => setOpen(false)}>
            Закрыть
          </Button>
          <Chart {...props} />
        </Box>
      </Modal>
    </>
  );
}
