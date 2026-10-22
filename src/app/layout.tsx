import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/ui/smooth-scroll";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#faf8f5",
};

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
    <html lang="es" className="light">
      <body className="bg-[#faf8f5] text-[#0f172a] selection:bg-emerald-600 selection:text-white min-h-screen flex flex-col noise-texture">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
