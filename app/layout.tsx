import type { Metadata } from "next";
import "./globals.css";
import AppThemeProvider from "./theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.i-am-significant.com"),
  title: {
    default: "i am significant — Натальная карта",
    template: "%s | i am significant",
  },
  description:
    "Постройте натальную карту по дате, времени и месту рождения. Узнайте положение планет, домов, Асцендента, MC и основные аспекты.",
  keywords: [
    "натальная карта",
    "натальная карта онлайн",
    "построить натальную карту",
    "астрология",
    "асцендент",
    "планеты в натальной карте",
    "дома натальной карты",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "i am significant — Натальная карта",
    description: "Постройте натальную карту по дате, времени и месту рождения.",
    type: "website",
    locale: "ru_RU",
    siteName: "i am significant",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body>
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}
