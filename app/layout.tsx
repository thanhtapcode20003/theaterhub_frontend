import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
// import { ThemeProvider } from "next-themes";
// import { Toaster } from "sonner";
// import { SessionProvider } from "next-auth/react";
// import { auth } from "@/auth";
import { ReactNode } from "react";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/contexts/AuthContext";

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
    <html lang="vi" suppressHydrationWarning className="bg-background">
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      {/* <SessionProvider session={session}> */}
      <body
        className={`${inter.className} ${spaceGrotesk.variable} antialiased bg-background`}
      >
        <AuthProvider>{children}</AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={10000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </body>
      {/* </SessionProvider> */}
    </html>
  );
};

export default RootLayout;
