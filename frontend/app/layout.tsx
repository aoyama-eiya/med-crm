import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "./components/Sidebar";
import LivePreview from "./components/LivePreview";

export const metadata: Metadata = {
  title: "Med CRM",
  description: "Medical CRM Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Noto+Sans+JP:wght@400;500;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />
      </head>
      <body className="flex h-screen w-full overflow-hidden bg-background text-foreground antialiased selection:bg-mac-accent selection:text-white">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-background relative pt-14 md:pt-0">
          <div className="flex-1 overflow-y-auto w-full p-4 md:p-8">
            <div className="max-w-[1200px] mx-auto w-full">
              {children}
            </div>
          </div>
        </main>

        <LivePreview />
      </body>
    </html>
  );
}
