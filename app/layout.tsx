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
          <div className="flex justify-end items-center px-4 py-2 bg-white border-b border-gray-100 shadow-sm">
            <LogoutButton />
          </div>
        )}
        {children}
      </body>
    </html>
  );
}
