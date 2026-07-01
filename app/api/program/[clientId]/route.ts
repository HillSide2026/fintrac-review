import { NextResponse } from "next/server";
import type { PatchItemBody, RemediationStatus } from "@/lib/program/types";
import { getProgramWithItems, updateRemediationItem } from "@/lib/program/db";

const VALID_STATUSES: RemediationStatus[] = [
  "not_started",
  "in_progress",
  "complete",
];

export async function GET(
  _request: Request,
  { params }: { params: { clientId: string } },
) {
  const { clientId } = params;

  const airtableKey = process.env.AIRTABLE_API_KEY;
  const airtableBase = process.env.AIRTABLE_BASE_ID;
  if (!airtableKey || !airtableBase) {
    return NextResponse.json(
      { error: "Data layer not configured." },
      { status: 503 },
    );
  }

  const data = await getProgramWithItems(clientId);
  if (!data) {
    return NextResponse.json({ error: "Program not found." }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: { clientId: string } },
) {
  const { clientId } = params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const p = (body ?? {}) as Record<string, unknown>;
  const itemId = typeof p.itemId === "string" ? p.itemId.trim() : "";
  const status = typeof p.status === "string" ? p.status : "";

  if (!itemId) {
    return NextResponse.json({ error: "itemId is required." }, { status: 400 });
  }

  if (!VALID_STATUSES.includes(status as RemediationStatus)) {
    return NextResponse.json(
      { error: "Invalid status value." },
      { status: 400 },
    );
  }

  const patchBody: PatchItemBody = { itemId, status: status as RemediationStatus };

  // MVP: clientId is present in the URL but ownership of itemId is not verified —
  // acceptable given the opaque UUID access model.
  void clientId;

  try {
    await updateRemediationItem(clientId, { id: patchBody.itemId, status: patchBody.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to update item." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, itemId: patchBody.itemId, status: patchBody.status });
}
