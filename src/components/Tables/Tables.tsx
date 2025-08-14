import { BreadcrumbBuilder } from "../BreadcrumbBuilder";

export function Tables() {
  return (
    <main className="flex flex-col w-full max-w-7xl self-center pb-6">
      <BreadcrumbBuilder
        previousPages={[
          { title: "Home", link: "/" },
          { title: "Dashboard", link: "/dashboard" },
        ]}
        currentPage={{ title: "Tournament Tables", link: "/dashboard/tables" }}
      />
      {/* Dashboard content */}
      <section className="flex flex-col mt-6">
        <h2 className="text-2xl font-bold mb-4">Tournament Tables</h2>
      </section>
    </main>
  );
}
