import { ReactNode } from "react";

import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/footer";
// import LeftSidebar from "@/components/navigation/LeftSidebar";
// import RightSidebar from "@/components/navigation/RightSidebar";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="realtive">
      <Navbar />

      <div className="flex">
        {/* Main content area */}
        <section className="flex min-h-screen flex-1 flex-col pb-6 pt-6 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </section>
      </div>
      <Footer />
    </main>
  );
};

export default RootLayout;
