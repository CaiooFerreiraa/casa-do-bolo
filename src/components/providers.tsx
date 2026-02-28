"use client";

import { SessionProvider } from "next-auth/react";
import { AdminProvider } from "@/lib/admin-context";
import { CartProvider } from "@/lib/cart-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AdminProvider>
    </SessionProvider>
  );
}
