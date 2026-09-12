import { getLocale } from "next-intl/server";
import { Baloo_2, Inter, Noto_Sans_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const notoMono = Noto_Sans_Mono({
  variable: "--font-noto-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Wordmark-only face (AfriVestLogo) — a rounded, heavy-weight display font
// for the thick/spaced logotype look; not used anywhere else, so it doesn't
// touch the DS's Inter-everywhere type system.
const baloo = Baloo_2({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

// Native CJK stack for the zh locale. Avoids shipping (and build-time fetching)
// the multi-megabyte Google CJK web fonts; Inter still renders Latin glyphs and
// numerals, with the OS Chinese face filling in CJK. Chosen for DS fidelity
// (clean sans, not serif) and zero download.
const CJK_SANS =
  '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", "Source Han Sans SC", sans-serif';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const isZh = locale === "zh";

  const fontClass = `${inter.variable} ${notoMono.variable} ${baloo.variable}`;

  const sans = isZh
    ? `var(--font-inter), ${CJK_SANS}`
    : "var(--font-inter), system-ui, sans-serif";

  const fontVars = {
    "--font-sans": sans,
    // DS uses Inter (a clean sans) for display in all locales.
    "--font-display": sans,
    "--font-mono": "var(--font-noto-mono), ui-monospace, monospace",
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
