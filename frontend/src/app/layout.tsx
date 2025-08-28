'use client';

import { Providers } from './providers';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}