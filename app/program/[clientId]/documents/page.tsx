import { notFound } from "next/navigation";
import { getProgramWithItems } from "@/lib/program/db";
import { DocumentManager } from "@/components/program/document-manager";

export default async function DocumentsPage({ params }: { params: { clientId: string } }) {
  const data = await getProgramWithItems(params.clientId);
  if (!data) notFound();

  return (
    <main style={{ fontFamily: "system-ui, sans-serif" }}>
      <DocumentManager documents={data.documents} />
    </main>
  );
}
