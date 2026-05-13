import { JobApplication, JobStatus } from "@/types";

const BASE = "/api/vagas";

export async function getJobs(): Promise<JobApplication[]> {
  const res = await fetch(BASE, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function getJobById(id: string): Promise<JobApplication | undefined> {
  const res = await fetch(`${BASE}/${id}`, { cache: "no-store" });
  if (!res.ok) return undefined;
  return res.json();
}

export async function createJob(
  data: Omit<JobApplication, "id" | "appliedAt" | "updatedAt" | "stages">
): Promise<JobApplication> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateJobStatus(
  id: string,
  newStatus: JobStatus,
  notes?: string
): Promise<JobApplication | null> {
  const res = await fetch(`${BASE}/${id}/stage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus, notes }),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function updateJob(
  id: string,
  data: Partial<Omit<JobApplication, "id" | "stages" | "appliedAt">>
): Promise<JobApplication | null> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function deleteJob(id: string): Promise<void> {
  await fetch(`${BASE}/${id}`, { method: "DELETE" });
}

export function getStats(jobs: JobApplication[]) {
  const total = jobs.length;
  const active = jobs.filter(
    (j) => !["aceito", "rejeitado", "desistencia", "cancelado"].includes(j.status)
  ).length;
  const aceito = jobs.filter((j) => j.status === "aceito").length;
  const rejeitado = jobs.filter((j) => j.status === "rejeitado").length;
  const proposta = jobs.filter((j) => j.status === "proposta").length;
  return { total, active, aceito, rejeitado, proposta };
}
