import type { RiskRating } from "@/lib/pre-diagnosis/types";

export type BandStyle = {
  background: string;
  border: string;
  color: string;
  label: string;
};

export const BAND_STYLES: Record<RiskRating, BandStyle> = {
  strong: {
    background: "#f0fdf4",
    border: "#bbf7d0",
    color: "#166534",
    label: "Program Foundations Present",
  },
  gaps_identified: {
    background: "#fffbeb",
    border: "#fde68a",
    color: "#92400e",
    label: "Gaps Identified",
  },
  material_deficiencies: {
    background: "#fef2f2",
    border: "#fecaca",
    color: "#b91c1c",
    label: "Risk Indicators Present",
  },
};

export const DISCLAIMER =
  "These preliminary findings are based on self-reported responses and are for informational purposes only. They do not constitute legal advice, a formal effectiveness review, or a compliance opinion. All findings require review by a qualified AML compliance lawyer before any conclusions can be drawn. No solicitor-client relationship is formed by this tool.";
