import { ReactNode } from "react";

const BookingLayout = ({ children }: { children: ReactNode }) => {
  return <section className="min-h-screen w-full bg-black">{children}</section>;
};

export default BookingLayout;
