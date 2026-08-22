import type { Metadata } from 'next';
import { ReduxProvider } from './providers';
import { AppShell } from './AppShell';
import '../index.css';

export const metadata: Metadata = {
  title: 'DevMorph - Transform Ideas into Websites with AI',
  description: 'Design, Personalize, and Launch Sites Faster Than Ever with Our AI Website Builder',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Quicksand:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-black text-white antialiased">
        <ReduxProvider>
          <AppShell>
            {children}
          </AppShell>
        </ReduxProvider>
      </body>
    </html>
  );
}
