export type JobStatus =
  | "candidatado"
  | "triagem"
  | "entrevista_rh"
  | "entrevista_tecnica"
  | "teste"
  | "proposta"
  | "aceito"
  | "rejeitado"
  | "desistencia"
  | "cancelado";

export interface StageEntry {
  id: string;
  status: JobStatus;
  date: string;
  notes?: string;
}

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  location?: string;
  url?: string;
  salary?: string;
  modality?: "presencial" | "remoto" | "hibrido";
  status: JobStatus;
  appliedAt: string;
  updatedAt: string;
  notes?: string;
  stages: StageEntry[];
  tags?: string[];
  companyColor?: string;
}

export const STATUS_CONFIG: Record<
  JobStatus,
  { label: string; color: string; bg: string; border: string; order: number }
> = {
  candidatado: {
    label: "Candidatado",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    order: 1,
  },
  triagem: {
    label: "Triagem",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    order: 2,
  },
  entrevista_rh: {
    label: "Entrevista RH",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    order: 3,
  },
  entrevista_tecnica: {
    label: "Entrevista Técnica",
    color: "text-cyan-700",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    order: 4,
  },
  teste: {
    label: "Teste/Desafio",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    order: 5,
  },
  proposta: {
    label: "Proposta Recebida",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    order: 6,
  },
  aceito: {
    label: "Aceito",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    order: 7,
  },
  rejeitado: {
    label: "Rejeitado",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    order: 8,
  },
  desistencia: {
    label: "Desistência",
    color: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-200",
    order: 9,
  },
  cancelado: {
    label: "Cancelado",
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    order: 10,
  },
};

export const PIPELINE_STATUSES: JobStatus[] = [
  "candidatado",
  "triagem",
  "entrevista_rh",
  "entrevista_tecnica",
  "teste",
  "proposta",
  "aceito",
];

export const TERMINAL_STATUSES: JobStatus[] = ["aceito", "rejeitado", "desistencia", "cancelado"];
