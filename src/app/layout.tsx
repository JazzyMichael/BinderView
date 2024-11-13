import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidenav from "@/components/Sidenav";
import { formatSets, sortSets, getSets } from "@/utilities/data";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = localFont({
  src: "../../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const revalidate = 100000;

export const metadata: Metadata = {
  title: "Binder View Pokemon Cards List",
  description:
    "Vintage to Modern, and Everything in-between. The best place to see full Pokemon card lists.",
  applicationName: "BinderView",
  openGraph: {
    images: ["/screenshots/landing-page-opengraph.jpg"],
    type: "website",
    title: "Binder View Pokemon Cards List",
    description:
      "Vintage to Modern, and Everything in-between. The best place to see full Pokemon card lists.",
    siteName: "BinderView",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { english } = await getSets();
  const seriesData = formatSets(english.data);

  const promos = { ...seriesData }.Promos;

  const dupe = { ...seriesData };

  delete dupe.Promos;
  delete dupe.SubSets;

  const fullItems = Object.values(dupe).reduce(
    (acc: any, cur: any) => [...acc, ...cur],
    []
  ) as any[];

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-geist-mono antialiased flex h-screen overflow-none`}
      >
        <Sidenav
          fulldata={dupe}
          promos={promos}
          oldestSort={sortSets("Oldest", fullItems)}
          newestSort={sortSets("Newest", fullItems)}
          // raw={seriesData}
        />

        <main id="main-content" className="grow h-full overflow-y-auto">
          {children}
        </main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
