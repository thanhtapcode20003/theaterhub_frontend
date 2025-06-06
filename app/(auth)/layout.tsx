import SocialAuthForm from "@/components/forms/SocialAuthForm";
import Image from "next/image";
import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 bg-auth">
      <section className="light-border background-light800 shadow-light100 min-w-full rounded-[10px] border px-4 py-10 shadow-md sm:min-w-[520px] sm:px-8">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-2.5">
            <h1 className="h2-bold text-dark100">Tham gia TheaterHub</h1>
            <p className="paragraph-regular text-dark500">
              Để trải nghiệm thế giới nghệ thuật kịch nói
            </p>
          </div>
          <Image
            src="/logo/logo_icon.png"
            width={50}
            height={50}
            alt="DevFlow Logo"
            className="object-contain w-[50px] h-[50px]"
          />
        </div>

        {children}

        <SocialAuthForm />
      </section>
    </main>
  );
};

export default AuthLayout;
