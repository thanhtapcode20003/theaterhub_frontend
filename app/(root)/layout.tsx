import { ReactNode } from "react";

import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/footer";
// import LeftSidebar from "@/components/navigation/LeftSidebar";
// import RightSidebar from "@/components/navigation/RightSidebar";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="relative">
      <Navbar />

      <div className="flex">
        {/* Main content area */}
        <section className="flex min-h-screen flex-1 flex-col pb-6 pt-6 max-md:pb-14 px-4 sm:px-14">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </section>
      </div>

      {/* Footer - hidden on mobile */}
      <div className="hidden md:block">
        <Footer />
      </div>
    </main>
  );
};

export default RootLayout;
