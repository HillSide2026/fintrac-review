// Phase 3: Auth-gated client portal layout
// Requires Supabase session — redirect to login if unauthenticated

// TODO: implement auth check via Supabase session middleware

export default function ProgramLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
