import { createInternalAssessment } from "@/lib/anthropic";
import { createIntakeSummary } from "@/lib/intake";
import { storeIntakeInAirtable } from "@/lib/integrations/airtable";
import { sendLeadToGhl } from "@/lib/integrations/ghl";
import { parseFintracIntakeAnswers } from "@/lib/validation";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const answers = parseFintracIntakeAnswers(payload);
    const summary = createIntakeSummary(answers);
    let assessment = null;

    try {
      assessment = await createInternalAssessment(answers);
    } catch (error) {
      console.error("Internal intake assessment failed.", error);
    }

    const leadResults = await Promise.allSettled([
      sendLeadToGhl({ answers, summary, assessment }),
      storeIntakeInAirtable({ answers, assessment }),
    ]);

    return NextResponse.json({
      summary,
      leadResults: leadResults.map((result) =>
        result.status === "fulfilled"
          ? result.value
          : {
              target: "integration",
              status: "failed",
              message:
                result.reason instanceof Error
                  ? result.reason.message
                  : "Unknown integration error.",
            },
      ),
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Unable to process the intake request." },
      { status: 500 },
    );
  }
}
