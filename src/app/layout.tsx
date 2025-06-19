import type { Metadata } from "next";
import "./globals.css";
import ClientApolloProvider from './ClientApolloProvider';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: "Gainz Factory - Growth Engine",
  description: "Your personal growth and habit tracking platform",
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
