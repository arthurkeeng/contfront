import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/lib/auth"
import "./globals.css"

export const metadata: Metadata = {
  title: "PropertyFlow ERP - Real Estate & Construction Management",
  description:
    "Streamline your real estate and construction operations with our comprehensive ERP solution. Manage properties, projects, contracts, and teams all in one platform.",
  keywords:
    "real estate ERP, construction management, property management, project tracking, tenant portal, maintenance management",
  authors: [{ name: "PropertyFlow ERP Team" }],
  creator: "PropertyFlow ERP",
  publisher: "PropertyFlow ERP",
  openGraph: {
    title: "PropertyFlow ERP - Real Estate & Construction Management",
    description: "Comprehensive ERP solution for real estate and construction companies",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PropertyFlow ERP - Real Estate & Construction Management",
    description: "Comprehensive ERP solution for real estate and construction companies",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
