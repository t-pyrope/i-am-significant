import { NatalChartProps } from "@/app/types";
import { Chart } from "@/app/components/Chart";
import { Button } from "@mui/material";
import { useState } from "react";
import { AppModal } from "@/app/components/AppModal";

export function ChartModal(props: NatalChartProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Открыть натал
      </Button>

      <AppModal open={open} onClose={() => setOpen(false)}>
        <Chart {...props} />
      </AppModal>
    </>
  );
}
