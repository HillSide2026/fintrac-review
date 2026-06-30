export type ConsultationRequest = {
  diagnosisToken: string;
  preferredDate: string;
  notes: string;
};

export type ConsultationRecord = {
  id: string;
  diagnosisToken: string;
  bookedAt: string;
  callDate: string;
  notes: string;
  status: "booked" | "completed" | "cancelled";
};
