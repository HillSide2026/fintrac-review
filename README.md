# FINTRAC Effectiveness Review Intake

Embed-first multi-step intake form for Levine Legal Professional Corporation. Collects information from Canadian reporting entities seeking a FINTRAC AML/ATF compliance program effectiveness review, generates an internal Claude assessment, and routes the intake to GHL and Airtable.

## Stack

- Next.js
- Tailwind CSS
- Anthropic Claude API (internal assessment notes only — never shown to the client)
- GoHighLevel webhook
- Airtable REST API

## Intake flow

Six steps collected from the client:

1. **Organization profile** — legal name, province, primary contact details
2. **Reporting entity & registration** — entity type (bank, MSB, credit union, etc.), FINTRAC registration status and number, compliance officer details
3. **Compliance program** — status of policies & procedures, risk assessment, training program, and ongoing monitoring; date of last policy review
4. **Reporting & recordkeeping** — which FINTRAC reports are filed (STRs, LCTRs, EFTRs), reporting process notes, recordkeeping notes
5. **Prior examinations** — examination history, findings or compliance orders, remediation status
6. **Scope & timing** — document availability, urgency level, target completion date, preferred scope of service (full review, gap assessment, document review, or targeted)

On submission, the server validates the payload, builds a structured summary, and optionally calls Claude to produce internal scoping notes (program gaps, compliance risks, missing information, scoping recommendations). The summary is returned to the client; the Claude assessment is for internal team use only and is forwarded to GHL and Airtable alongside the full intake.

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example environment file and fill in the values you want enabled:

   ```bash
   cp .env.example .env.local
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

## Environment variables

- `ANTHROPIC_API_KEY`: Optional. When present, the server generates internal scoping notes for the legal team after each submission.
- `ANTHROPIC_MODEL`: Optional model override. Defaults to `claude-sonnet-4-6`.
- `GHL_WEBHOOK_URL`: Optional GoHighLevel workflow webhook URL for lead capture.
- `AIRTABLE_API_KEY`: Optional Airtable personal access token.
- `AIRTABLE_BASE_ID`: Required when Airtable storage is enabled.
- `AIRTABLE_TABLE_NAME`: Optional Airtable table name. Defaults to `FINTRAC Intakes`.
- `EMBED_ALLOWED_ORIGINS`: Optional comma-separated list of allowed iframe parent origins, for example `https://sites.leadconnectorhq.com,https://yourdomain.com`.

If `GHL_WEBHOOK_URL` is not set, GHL delivery is skipped.  
If Airtable credentials are not set, Airtable storage is skipped.  
If neither is configured, the form still works for preview purposes but no lead is captured.

## Airtable fields

Create an Airtable table with these field names:

- `name`
- `email`
- `company`
- `answers`
- `assessment`
- `created_at`

## Iframe embed

The app is designed to run inside an iframe on a GHL landing page. It automatically posts `fintrac:embed-resize` messages to the parent window so the iframe height tracks the form content.

Add this to the GHL page in a custom HTML block:

```html
<iframe
  class="fintrac-embed"
  src="https://YOUR-VERCEL-APP.vercel.app/"
  title="FINTRAC Effectiveness Review Intake"
  loading="lazy"
  scrolling="no"
  style="width:100%;border:0;min-height:720px;background:transparent;"
></iframe>

<script>
  (function () {
    if (window.__fintracEmbedBound) return;
    window.__fintracEmbedBound = true;

    window.addEventListener("message", function (event) {
      if (!event.data || event.data.type !== "fintrac:embed-resize") return;

      document.querySelectorAll("iframe.fintrac-embed").forEach(function (frame) {
        if (frame.contentWindow === event.source) {
          frame.style.height = Math.max(event.data.height || 0, 720) + "px";
        }
      });
    });
  })();
</script>
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
