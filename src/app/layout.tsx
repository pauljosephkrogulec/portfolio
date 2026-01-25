import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paul-Joseph Krogulec - Développeur Symfony",
  description: "Développeur backend spécialisé en Symfony et API Platform. Expérimenté dans la création d'applications web robustes avec du code propre et efficace suivant les meilleures pratiques.",
  keywords: ["développeur", "backend", "Symfony", "API Platform", "développement web", "PHP"],
  authors: [{ name: "Paul-Joseph Krogulec" }],
  creator: "Paul-Joseph Krogulec",
  icons: {
    icon: "/logo.jpeg",
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
  openGraph: {
    title: "Paul-Joseph Krogulec - Développeur Symfony",
    description: "Développeur backend spécialisé en Symfony et API Platform. Expérimenté dans la création d'applications web robustes avec du code propre et efficace suivant les meilleures pratiques.",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paul-Joseph Krogulec - Développeur Symfony",
    description: "Développeur backend spécialisé en Symfony et API Platform. Expérimenté dans la création d'applications web robustes avec du code propre et efficace suivant les meilleures pratiques.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://paul-joseph-krogulec.dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/logo.jpeg" type="image/jpeg" />
        <link rel="shortcut icon" href="/logo.jpeg" type="image/jpeg" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
