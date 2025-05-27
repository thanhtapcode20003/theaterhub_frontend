import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
// import { ThemeProvider } from "next-themes";
// import { Toaster } from "sonner";
// import { SessionProvider } from "next-auth/react";
// import { auth } from "@/auth";
import { ReactNode } from "react";

const inter = localFont({
  src: "./fonts/InterVF.ttf",
  variable: "--font-inter",
  weight: "100 200 300 400 500 700 800 900",
});

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGroteskVF.ttf",
  variable: "--font-space-grotesk",
  weight: "300 400 500 700",
});

export const metadata: Metadata = {
  title: "TheaterHub",
  description:
    "TheaterHub is a platform for drama enthusiasm. It provides a space for users to share their thoughts and experiences about various plays, movies, and performances.",
  icons: {
    icon: "/images/site-logo.svg",
  },
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  // const session = await auth();

  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      {/* <SessionProvider session={session}> */}
      <body
        className={`${inter.className} ${spaceGrotesk.variable} antialiased`}
      >
        {/* <ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					> */}
        {children}
        {/* </ThemeProvider> */}
        {/* <Toaster position="top-right" /> */}
      </body>
      {/* </SessionProvider> */}
    </html>
  );
};

export default RootLayout;
