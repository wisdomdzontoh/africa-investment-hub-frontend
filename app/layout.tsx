import { getLocale } from "next-intl/server";
import {
  Hanken_Grotesk,
  IBM_Plex_Mono,
  Noto_Sans_SC,
  Noto_Serif_SC,
  Spectral,
} from "next/font/google";
import "./globals.css";

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const notoSansSc = Noto_Sans_SC({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const notoSerifSc = Noto_Serif_SC({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const isZh = locale === "zh";

  const fontClass = isZh
    ? `${spectral.variable} ${notoSansSc.variable} ${notoSerifSc.variable} ${plexMono.variable}`
    : `${spectral.variable} ${hanken.variable} ${plexMono.variable}`;

  const fontVars = {
    "--font-sans": isZh
      ? "var(--font-noto-sans), system-ui, sans-serif"
      : "var(--font-hanken), system-ui, sans-serif",
    "--font-display": isZh
      ? "var(--font-noto-serif), Georgia, serif"
      : "var(--font-spectral), Georgia, serif",
    "--font-mono": "var(--font-plex), ui-monospace, monospace",
  } as React.CSSProperties;

  return (
    <html
      lang={locale}
      className={`${fontClass} h-full antialiased`}
      style={fontVars}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
