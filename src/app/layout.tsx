import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/ui/smooth-scroll";

export const metadata: Metadata = {
  title: "Cúmulo — Calculadora de Interés Compuesto & Proyector Patrimonial",
  description:
    "Simula el crecimiento exponencial de tus inversiones con interés compuesto, aportaciones periódicas, ajuste por inflación y desglose año por año.",
  keywords: [
    "calculadora interes compuesto",
    "interes compuesto",
    "inversiones",
    "cetes",
    "sp500",
    "finanzas personales",
    "libertad financiera",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="bg-[#091322] text-[#f8fafc] selection:bg-[#10b981] selection:text-black min-h-screen flex flex-col noise-texture">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
