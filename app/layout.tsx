import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import LogoutButton from "./components/LogoutButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Minicon Agent Command Center",
  description: "Agent dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("hub_session")?.value;

  return (
    <html lang="en">
      <body className={inter.className}>
        {isLoggedIn && (
          <nav className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <a href="/" className="text-sm font-semibold text-gray-900 hover:text-blue-600">Dashboard</a>
              <a href="/milestones" className="text-sm font-medium text-gray-500 hover:text-blue-600">Milestones</a>
              <a href="/metrics" className="text-sm font-medium text-gray-500 hover:text-blue-600">Metrics</a>
              <a href="/database" className="text-sm font-medium text-gray-500 hover:text-blue-600">Database</a>
            </div>
            <LogoutButton />
          </nav>
        )}
        {children}
      </body>
    </html>
  );
}
