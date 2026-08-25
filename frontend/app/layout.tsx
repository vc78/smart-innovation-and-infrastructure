import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import MediaFallbackInjector from "@/components/media-fallback-injector"
import { Suspense } from "react"
import Script from "next/script"
import "./globals.css"
import PageTheme from "@/components/page-theme"
import { LanguageProvider } from "@/contexts/language-context"
import ErrorBoundary from "@/components/error-boundary"
import { Toaster } from "@/components/ui/toaster"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: {
    default: "SIID - Smart Innovation & Infrastructure Design",
    template: "%s | SIID Platform",
  },
  description:
    "Empowering architects, structural engineers, and contractors with AI-driven parametric floor plan generation, real-time BOQ cost estimation, Vastu spatial audits, and MEP routing.",
  keywords: [
    "Smart Architecture",
    "AI Floor Plan Generator",
    "Parametric Design",
    "MEP Engineering",
    "Contractor Marketplace",
    "Vastu Compliance Engine",
    "3D Building Generator",
    "Construction BOQ Calculator",
  ],
  authors: [{ name: "SIID Engineering Team" }],
  creator: "SIID",
  publisher: "SIID Platforms",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://siid.app"),
  openGraph: {
    title: "SIID - Smart Innovation & Infrastructure Design",
    description: "Accelerate architectural design & construction workflows with AI parametric models and verified contractor matching.",
    url: "https://siid.app",
    siteName: "SIID Platform",
    images: [
      {
        url: "/images/hero_architectural_render.png",
        width: 1200,
        height: 630,
        alt: "SIID AI Architectural Rendering Engine",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SIID - Smart Innovation & Infrastructure Design",
    description: "AI-powered parametric design, real-time BOQ estimation, and verified contractor marketplace.",
    images: ["/images/hero_architectural_render.png"],
    creator: "@siid_tech",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon-dark-32x32.png",
    shortcut: "/icon-dark-32x32.png",
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1e3a8a" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
}

// JSON-LD Structured Data Schema for Search Engine SEO
const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "SIID Platform",
      "operatingSystem": "Web Browser",
      "applicationCategory": "DesignApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "description": "AI-powered architectural 3D modeling, floor plan generation, BOQ cost estimation, and MEP routing platform.",
    },
    {
      "@type": "Organization",
      "name": "SIID Technologies",
      "url": "https://siid.app",
      "logo": "https://siid.app/images/siid-flash-logo.png",
      "sameAs": [
        "https://twitter.com",
        "https://linkedin.com",
        "https://github.com",
      ],
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SIID" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className={`font-sans ${geistSans.variable} ${geistMono.variable} overflow-x-hidden antialiased bg-background text-foreground`}>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <LanguageProvider>
              <PageTheme />
              <MediaFallbackInjector />
              {children}
              <Toaster />
            </LanguageProvider>
          </Suspense>
        </ErrorBoundary>
        <Script id="tawk-to" strategy="lazyOnload">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
            })();
          `}
        </Script>
      </body>
    </html>
  )
}
