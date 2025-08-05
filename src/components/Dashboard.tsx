"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { SlashIcon } from "lucide-react";
import { BreadcrumbBuilder } from "./BreadcrumbBuilder";

export function Dashboard({}) {
  return (
    <main className="flex flex-col w-full max-w-7xl self-center">
      <BreadcrumbBuilder
        previousPages={[{ title: "Home", link: "/" }]}
        currentPage={{ title: "Dashboard", link: "/dashboard" }}
      />
      {/* Dashboard content */}
      <section className="mt-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </section>
    </main>
  );
}
