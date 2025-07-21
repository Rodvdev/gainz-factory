import type { Metadata } from "next";
import "./globals.css";
import ClientApolloProvider from './ClientApolloProvider';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: "Gainz Factory - Transformation OS",
  description: "Tu plataforma completa de transformación personal. Hábitos, entrenamiento, nutrición, recetas fit y desarrollo personal. Construye la mejor versión de ti mismo con @elchepaaa.",
  keywords: "hábitos, entrenamiento, nutrición, recetas fit, desarrollo personal, transformación, fitness, bodybuilding, crecimiento personal, rutinas, meditación, productividad",
  authors: [{ name: "El Chepaaa", url: "https://www.instagram.com/elchepaaa/" }],
  creator: "Gainz Factory",
  publisher: "Gainz Factory",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://gainzfactory.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Gainz Factory - Transformation OS",
    description: "Tu plataforma completa de transformación personal. Hábitos, entrenamiento, nutrición, recetas fit y desarrollo personal.",
    url: "https://gainzfactory.com",
    siteName: "Gainz Factory",
    images: [
      {
        url: "/logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Gainz Factory Logo",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gainz Factory - Transformation OS",
    description: "Tu plataforma completa de transformación personal. Hábitos, entrenamiento, nutrición, recetas fit y desarrollo personal.",
    images: ["/logo.jpeg"],
    creator: "@elchepaaa",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var darkMode = localStorage.getItem('darkMode');
                  if (darkMode === 'true') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={` antialiased h-full bg-gray-50 dark:bg-gray-900`}
      >
        <ClientApolloProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ClientApolloProvider>
      </body>
    </html>
  );
}
