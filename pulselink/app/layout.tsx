import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'PulseLink — Smart Ambulance Platform',
  description:
    'From Ambulance to Emergency Room — Before the Patient Arrives. Real-time patient data, AI-assisted ECG screening, live ambulance tracking and hospital preparedness.',
  keywords: ['ambulance', 'ECG', 'emergency', 'hospital', 'AI', 'paramedic', 'PulseLink'],
  authors: [{ name: 'PulseLink Team' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PulseLink',
  },
};

export const viewport: Viewport = {
  themeColor: '#05080f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
