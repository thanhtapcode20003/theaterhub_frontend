import { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="relative">
      <div className="flex">
        {/* Main content area */}
        <section className="flex min-h-screen flex-1 flex-col pb-6 pt-6 max-md:pb-14 px-4">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default RootLayout;
