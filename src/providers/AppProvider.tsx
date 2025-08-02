"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "./AuthProvider";

type Props = {
  children: ReactNode;
};

// This is where all app-wide context providers are added. E.g. AuthProvider, ThemeProvider, etc.

export function AppProvider({ children }: Props) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
}
