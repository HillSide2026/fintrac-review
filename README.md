# Canadian Startup Clinic MVP

Minimal embed-first MVP for a Canadian startup incorporation intake flow built with Next.js, Tailwind, Claude, GHL, and Airtable.

## Stack

- Next.js
- Tailwind CSS
- Anthropic Claude API for internal notes only
- GoHighLevel webhook
- Airtable REST API

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

- `ANTHROPIC_API_KEY`: Optional. When present, the server generates internal-only intake notes for staff.
- `ANTHROPIC_MODEL`: Optional model override. Defaults to `claude-3-5-sonnet-latest`.
- `GHL_WEBHOOK_URL`: Optional GoHighLevel workflow webhook URL for lead capture.
- `AIRTABLE_API_KEY`: Optional Airtable personal access token.
- `AIRTABLE_BASE_ID`: Required when Airtable storage is enabled.
- `AIRTABLE_TABLE_NAME`: Optional Airtable table name. Defaults to `Assessments`.
- `EMBED_ALLOWED_ORIGINS`: Optional comma-separated list of allowed iframe parent origins, for example `https://sites.leadconnectorhq.com,https://yourdomain.com`.

If `GHL_WEBHOOK_URL` is not set, GHL delivery is skipped.
If Airtable credentials are not set, Airtable storage is skipped.
If neither is configured, the form still works for preview purposes, but no lead is captured.

## Airtable fields

Create an Airtable table with these field names:

- `name`
- `email`
- `company`
- `answers`
- `assessment`
- `created_at`

## GHL single-page embed

Recommended architecture:

1. Keep the GHL page as the only landing page.
2. Leave the hero and CTA in GHL.
3. Make the hero CTA scroll to the first existing purchase-form section.
4. Replace the purchase form widget inside each purchase-form section with a custom HTML block that loads this app in an iframe.
5. Let the Next.js app handle the intake, Claude call, GHL webhook delivery, and Airtable storage server-side.

The current preview page already has two purchase-form sections wired as one-step order blocks:

- `section-EnSH2sIQyz` with `.one-step-order-iMornIqEiP`
- `section-4ApCUbMV7J` with `.one-step-order-U9Jm8MjeEu`

In each of those sections, remove the purchase form element and replace it with:

```html
<iframe
  class="startup-clinic-embed"
  src="https://YOUR-VERCEL-APP.vercel.app/"
  title="Canadian Startup Clinic"
  loading="lazy"
  scrolling="no"
  style="width:100%;border:0;min-height:720px;background:transparent;"
></iframe>

<script>
  (function () {
    if (window.__startupClinicEmbedBound) return;
    window.__startupClinicEmbedBound = true;

    window.addEventListener("message", function (event) {
      if (!event.data || event.data.type !== "incorp:embed-resize") return;

      document.querySelectorAll("iframe.startup-clinic-embed").forEach(function (frame) {
        if (frame.contentWindow === event.source) {
          frame.style.height = Math.max(event.data.height || 0, 720) + "px";
        }
      });
    });
  })();
</script>
```

That gives you one GHL landing page, one embedded skill UI, and no duplicate landing page on Vercel.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
