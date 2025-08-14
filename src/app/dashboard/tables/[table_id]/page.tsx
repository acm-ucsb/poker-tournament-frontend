export default async function Page({
  params,
}: {
  params: Promise<{ table_id: string }>;
}) {
  const { table_id } = await params;
  return <div>Table ID: {table_id}</div>;
}
