import { notFound } from "next/navigation";
import { getProgramWithItems } from "@/lib/program/db";
import { ProgramDashboard } from "@/components/program/program-dashboard";

export default async function ProgramPage({ params }: { params: { clientId: string } }) {
  const data = await getProgramWithItems(params.clientId);
  if (!data) notFound();

  return (
    <main style={{ fontFamily: "system-ui, sans-serif" }}>
      <ProgramDashboard
        program={data.program}
        pillarHealth={data.pillarHealth}
        items={data.items}
      />
    </main>
  );
}
