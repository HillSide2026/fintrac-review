import { notFound } from "next/navigation";
import { getProgramWithItems } from "@/lib/program/db";
import { ProgramQueryProvider } from "@/components/program/query-provider";
import { RemediationTracker } from "@/components/program/remediation-tracker";

export default async function RemediationPage({ params }: { params: { clientId: string } }) {
  const data = await getProgramWithItems(params.clientId);
  if (!data) notFound();

  return (
    <main style={{ fontFamily: "system-ui, sans-serif" }}>
      <ProgramQueryProvider>
        <RemediationTracker
          clientId={params.clientId}
          initialItems={data.items}
        />
      </ProgramQueryProvider>
    </main>
  );
}
