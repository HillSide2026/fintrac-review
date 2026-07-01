import { PILLAR_LABELS, PILLAR_ORDER } from "@/lib/pre-diagnosis/questions";
import type { RemediationItem, PillarHealth } from "./types";

export function computePillarHealth(items: RemediationItem[]): PillarHealth[] {
  const byPillar = new Map<string, RemediationItem[]>();

  for (const item of items) {
    const list = byPillar.get(item.pillar) ?? [];
    list.push(item);
    byPillar.set(item.pillar, list);
  }

  const results: PillarHealth[] = PILLAR_ORDER.map((pillar) => {
    const pillarItems = byPillar.get(pillar) ?? [];
    byPillar.delete(pillar);
    const complete = pillarItems.filter((i) => i.status === "complete").length;
    const total = pillarItems.length;
    const hasCritical = pillarItems.some(
      (i) => i.priority === "critical" && i.status !== "complete",
    );
    const pct = total === 0 ? 100 : Math.round((complete / total) * 100);
    return {
      pillar,
      label: PILLAR_LABELS[pillar as keyof typeof PILLAR_LABELS],
      total,
      complete,
      hasCritical,
      pct,
    };
  });

  // Remaining items whose pillar is not in PILLAR_ORDER
  const otherItems: RemediationItem[] = [];
  for (const remaining of byPillar.values()) {
    otherItems.push(...remaining);
  }

  if (otherItems.length > 0) {
    const complete = otherItems.filter((i) => i.status === "complete").length;
    const total = otherItems.length;
    const hasCritical = otherItems.some(
      (i) => i.priority === "critical" && i.status !== "complete",
    );
    const pct = total === 0 ? 100 : Math.round((complete / total) * 100);
    results.push({ pillar: "other", label: "Other", total, complete, hasCritical, pct });
  }

  return results;
}
