import { headers } from "next/headers";
import "./globals.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const origin = new URL(`${protocol}://${host}`);
  const description = "A multi-tenant contractor operating system for CRM, estimating, projects, trade partners, documents, tasks, and job-cost visibility.";
  const socialImage = new URL("/og.png", origin).toString();

  return (
    <html lang="en">
      <head>
        <title>ACMI Construction OS</title>
        <meta name="description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ACMI Construction OS" />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={socialImage} />
        <meta property="og:image:width" content="1731" />
        <meta property="og:image:height" content="909" />
        <meta property="og:image:alt" content="ACMI Construction OS operating dashboard" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ACMI Construction OS" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={socialImage} />
      </head>
      <body>{children}</body>
    </html>
  );
}
