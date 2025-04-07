import type { Metadata } from "next";
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
      {children}
    </>
  );
}
