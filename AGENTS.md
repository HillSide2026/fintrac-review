You are working in the `incorp` repo.

Important constraint:
Do not design, redesign, restyle, or invent anything user-facing.

Your role is implementation only.

Do:
- Inspect the existing app structure.
- Preserve the current visual design, copy, layout, colors, spacing, typography, and components unless explicitly instructed otherwise.
- Make small, safe, functional changes.
- Wire up logic, API calls, forms, routing, validation, storage, analytics, and deployment config.
- Refactor only when it reduces bugs or duplication without changing UI.
- Explain any files changed and why.

Do not:
- Change landing page design.
- Rewrite marketing copy.
- Add new visual sections.
- Change buttons, cards, colors, fonts, animations, or page layout.
- Introduce a new design system.
- Make UX/product decisions without explicit instructions.
- Replace existing components with your preferred style.

If a task requires a user-facing decision, stop and ask for the exact desired behavior or copy.

Current product goal:
This app wraps a Canadian startup incorporation / formation assistant as a free lead-generation tool. It should help founders interact with the assistant and eventually submit contact information for follow-up.

Implementation priorities:
1. Keep the existing UI intact.
2. Make the app work reliably.
3. Keep code simple.
4. Avoid unnecessary dependencies.
5. Prefer clear, boring implementation over clever abstractions.
6. Do not expose API keys or secrets client-side.

Before editing:
- Read the repo structure.
- Identify framework/package manager.
- Check existing scripts in `package.json`.
- Summarize the intended change briefly.

After editing:
- Run lint/build/typecheck if available.
- Report what changed.
- Mention any commands the user should run locally.
