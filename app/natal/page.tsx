"use client";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { isNatalChart, type NatalChart } from "../types";
import { useRouter } from "next/navigation";
import { MoneyReport } from "@/app/natal/MoneyReport";
import { NATAL_STORAGE_KEY } from "@/app/natal/constants";
import { PageLoader } from "@/app/components/PageLoader";
import { Header } from "@/app/components/Header";
import { PageFooter } from "@/app/components/PageFooter";

export default function NatalPage() {
  const [chart, setChart] = useState<NatalChart | null>(null);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    queueMicrotask(() => {
      const savedNatalChart = localStorage.getItem(NATAL_STORAGE_KEY);

      if (savedNatalChart) {
        try {
          const parsed: unknown = JSON.parse(savedNatalChart);

          if (isNatalChart(parsed)) {
            setChart(parsed);
          } else {
            localStorage.removeItem(NATAL_STORAGE_KEY);
            router.replace("/");
          }
        } catch {
          localStorage.removeItem(NATAL_STORAGE_KEY);
          router.replace("/");
        }
      } else {
        router.replace("/");
      }

      setTimeout(setHasCheckedStorage, 200, true);
    });
  }, [router]);

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100svh",
      }}
    >
      <Header />
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          px: { xs: 3, sm: 4 },
          py: { xs: 4, sm: 6 },
        }}
      >
        {!hasCheckedStorage ? <PageLoader /> : null}
        {hasCheckedStorage && chart ? <MoneyReport chart={chart} /> : null}
      </Box>

      <PageFooter />
    </Box>
  );
}
