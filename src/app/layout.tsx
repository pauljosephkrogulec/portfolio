import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paul-Joseph Krogulec - Développeur Symfony",
  description: "Développeur backend spécialisé en Symfony et API Platform. Expérimenté dans la création d'applications web robustes avec du code propre et efficace suivant les meilleures pratiques.",
  keywords: ["développeur", "backend", "Symfony", "API Platform", "développement web", "PHP"],
  authors: [{ name: "Paul-Joseph Krogulec" }],
  creator: "Paul-Joseph Krogulec",
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
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
