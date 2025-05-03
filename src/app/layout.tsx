import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import { ThemeProvider } from "@/components/theme-provider"; // Import ThemeProvider
import { cn } from "@/lib/utils"; // Import cn utility

export const metadata: Metadata = {
  title: 'WebCrafter', // Updated title
  description: 'Generate web code snippets with AI assistance.', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(GeistSans.className, "font-sans antialiased")}
        suppressHydrationWarning // Add suppressHydrationWarning here
      >
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster /> {/* Add Toaster component */}
          </ThemeProvider>
      </body>
    </html>
  );
}
