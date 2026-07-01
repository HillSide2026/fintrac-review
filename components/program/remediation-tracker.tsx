"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  RemediationItem,
  RemediationStatus,
  RemediationPriority,
  ProgramWithItems,
  PatchItemBody,
  PatchItemResponse,
} from "@/lib/program/types";
import { PILLAR_LABELS, PILLAR_ORDER } from "@/lib/pre-diagnosis/questions";

type RemediationTrackerProps = {
  clientId: string;
  initialItems: RemediationItem[];
};

type PriorityConfig = {
  label: string;
  background: string;
  border: string;
  color: string;
};

const PRIORITY_CONFIG: Record<RemediationPriority, PriorityConfig> = {
  critical: { label: "Critical", background: "#fef2f2", border: "#fecaca", color: "#b91c1c" },
  high: { label: "High", background: "#fffbeb", border: "#fde68a", color: "#92400e" },
  medium: { label: "Medium", background: "#f9fafb", border: "#d1d5db", color: "#374151" },
  low: { label: "Low", background: "#f9fafb", border: "#e5e7eb", color: "#6b7280" },
};

const badgeBaseStyle = {
  fontSize: "12px",
  fontWeight: 500,
  padding: "2px 8px",
  borderRadius: "6px",
  border: "1px solid",
  display: "inline-block",
} as const;

const selectStyle = {
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px" as const,
  padding: "8px 12px",
  color: "#111827",
  background: "#fff",
};

const sectionHeadingStyle = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#1d4771",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: 0,
};

export function RemediationTracker({ clientId, initialItems }: RemediationTrackerProps) {
  const queryClient = useQueryClient();
  const queryKey = ["program", clientId, "items"] as const;

  const { data: items } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await fetch(`/api/program/${clientId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = (await res.json()) as ProgramWithItems;
      return data.items;
    },
    initialData: initialItems,
    staleTime: 30_000,
  });

  const mutation = useMutation({
    mutationFn: async ({ itemId, status }: PatchItemBody) => {
      const res = await fetch(`/api/program/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, status }),
      });
      if (!res.ok) throw new Error("Update failed");
      return (await res.json()) as PatchItemResponse;
    },
    onMutate: async ({ itemId, status }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<RemediationItem[]>(queryKey);
      queryClient.setQueryData<RemediationItem[]>(queryKey, (old) =>
        old?.map((item) => (item.id === itemId ? { ...item, status } : item)) ?? [],
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  const displayItems = items ?? [];

  const grouped = new Map<string, RemediationItem[]>();
  for (const item of displayItems) {
    const list = grouped.get(item.pillar) ?? [];
    list.push(item);
    grouped.set(item.pillar, list);
  }

  const orderedPillars: string[] = [
    ...PILLAR_ORDER.filter((p) => grouped.has(p)),
    ...[...grouped.keys()].filter((p) => !PILLAR_ORDER.includes(p as never)),
  ];

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: "720px",
        margin: "0 auto",
        padding: "24px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        color: "#111827",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <a
          href="../"
          style={{ fontSize: "13px", color: "#1d4771", textDecoration: "none" }}
        >
          ← Dashboard
        </a>
        <p style={{ fontSize: "15px", fontWeight: 600, color: "#1d4771", margin: 0 }}>
          Remediation Tracker
        </p>
      </div>

      {mutation.isError && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            fontSize: "13px",
            borderRadius: "8px",
            padding: "8px 12px",
          }}
        >
          Status update failed. Your change has been reverted.
        </div>
      )}

      {displayItems.length === 0 ? (
        <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
          No remediation items have been added to this program yet.
        </p>
      ) : (
        orderedPillars.map((pillar) => {
          const pillarItems = grouped.get(pillar) ?? [];
          const pillarLabel =
            PILLAR_LABELS[pillar as keyof typeof PILLAR_LABELS] ?? pillar;

          return (
            <div key={pillar} style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              <p style={{ ...sectionHeadingStyle, marginBottom: "4px" }}>{pillarLabel}</p>
              {pillarItems.map((item) => {
                const priorityConfig = PRIORITY_CONFIG[item.priority];
                const isPending =
                  mutation.isPending && mutation.variables?.itemId === item.id;

                return (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      padding: "12px 0",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <span style={{ fontSize: "14px", color: "#111827" }}>
                      {item.description}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          style={{
                            ...badgeBaseStyle,
                            background: priorityConfig.background,
                            borderColor: priorityConfig.border,
                            color: priorityConfig.color,
                          }}
                        >
                          {priorityConfig.label}
                        </span>
                        {item.dueDate && (
                          <span style={{ fontSize: "12px", color: "#6b7280" }}>
                            Due: {item.dueDate}
                          </span>
                        )}
                      </div>
                      <select
                        value={item.status}
                        disabled={isPending}
                        style={selectStyle}
                        onChange={(e) =>
                          mutation.mutate({
                            itemId: item.id,
                            status: e.target.value as RemediationStatus,
                          })
                        }
                      >
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="complete">Complete</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })
      )}
    </div>
  );
}
