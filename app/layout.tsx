import type { Metadata } from "next";
import { Pinyon_Script, Playfair_Display } from "next/font/google";
import "./globals.css";
import AppThemeProvider from "./theme-provider";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

const pinyonScript = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pinyon-script",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.i-am-significant.com"),
  title: {
    default: "Natalia astro psychology Prague",
    template: "%s | Natalia astro psychology Prague",
  },
  description:
    "Узнай, через что приходят деньги и какие способности помогут увеличить доход - индивидуально по твоей натальной карте",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Natalia astro psychology Prague",
    description:
      "Узнай, через что приходят деньги и какие способности помогут увеличить доход - индивидуально по твоей натальной карте",
    type: "website",
    locale: "ru_RU",
    siteName: "Natalia astro psychology Prague",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${playfairDisplay.variable} ${pinyonScript.variable}`}
    >
      <body>
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}
