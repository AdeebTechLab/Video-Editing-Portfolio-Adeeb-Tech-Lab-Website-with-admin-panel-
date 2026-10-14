import type { Metadata } from "next";
import "./globals.css";
const base = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  metadataBase: new URL(base || "http://127.0.0.1:3000"),
  title:
    "Adeeb Tech Lab | Professional Video Editing & Creative Production",
  description:
    "Explore professional video editing, motion graphics, cinematic storytelling, and creative video production services by Adeeb Tech Lab.",
  ...(base
    ? { metadataBase: new URL(base), alternates: { canonical: base } }
    : {}),
  openGraph: {
    title: "Adeeb Tech Lab — Creativity in motion",
    description: "Video Editing & Creative Production",
    images: [
      {
        url: "/images/social.jpg",
        width: 1200,
        height: 630,
        alt: "Adeeb Tech Lab — Video Editing & Creative Production",
      },
    ],
    type: "website",
  },
  twitter: { card: "summary_large_image", images: ["/images/social.jpg"] },
  icons: { icon: "/images/logo.png" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Adeeb Tech Lab",
              url: "https://adeebtechlab.com/",
              email: "info.AdeebTechLab@gmail.com",
              telephone: "+923092333121",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Bahawalpur",
                addressCountry: "PK",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
