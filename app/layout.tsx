import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Minicon Hub',
  description: 'Minicon Agent Command Center',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
