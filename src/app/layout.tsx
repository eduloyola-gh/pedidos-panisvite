import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "MFEL Obrador - Panadería Artesanal",
  description: "Haz tus pedidos semanales de pan y repostería artesanal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <CartProvider>
            {children}
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
