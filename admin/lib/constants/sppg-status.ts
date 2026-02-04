export const SPPG_STATUS_MAP: Record<number, string> = {
  1: "Assign Investor",
  2: "Dokumen Pendaftaran",
  3: "Proses Persiapan",
  4: "Validasi Data Persiapan",
  5: "Appraisal Biaya Sewa",
  6: "Validasi Data Pendaftaran",
  7: "Perjanjian Sewa"
};

export const SPPG_STATUS_OPTIONS = Object.entries(SPPG_STATUS_MAP).map(([value, label]) => ({
  value: parseInt(value),
  label
}));

export function getSppgStatusLabel(status: number | null | undefined): string {
  if (status === null || status === undefined) return 'Preparation';
  return SPPG_STATUS_MAP[status] || 'Unknown Status';
}
