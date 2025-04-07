import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import "@radix-ui/themes/styles.css";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "CIL",
  description: "Control de Inventario",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
