import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { JobApplication, JobStatus, StageEntry } from "@/types";

type PrismaJob = {
  id: string;
  company: string;
  position: string;
  location: string | null;
  url: string | null;
  salary: string | null;
  modality: string | null;
  status: string;
  notes: string | null;
  tags: string;
  appliedAt: Date;
  updatedAt: Date;
  stages: { id: string; status: string; date: Date; notes: string | null }[];
};

function serialize(job: PrismaJob): JobApplication {
  return {
    id: job.id,
    company: job.company,
    position: job.position,
    location: job.location ?? undefined,
    url: job.url ?? undefined,
    salary: job.salary ?? undefined,
    modality: (job.modality as JobApplication["modality"]) ?? undefined,
    status: job.status as JobStatus,
    notes: job.notes ?? undefined,
    tags: JSON.parse(job.tags || "[]"),
    appliedAt: job.appliedAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
    stages: job.stages.map(
      (s): StageEntry => ({
        id: s.id,
        status: s.status as JobStatus,
        date: s.date.toISOString(),
        notes: s.notes ?? undefined,
      })
    ),
  };
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await prisma.jobApplication.findUnique({
    where: { id },
    include: { stages: { orderBy: { date: "asc" } } },
  });
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serialize(job));
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  try {
    const job = await prisma.jobApplication.update({
      where: { id },
      data: {
        company: body.company,
        position: body.position,
        location: body.location ?? null,
        url: body.url ?? null,
        salary: body.salary ?? null,
        modality: body.modality ?? null,
        status: body.status,
        notes: body.notes ?? null,
        tags: JSON.stringify(body.tags ?? []),
      },
      include: { stages: { orderBy: { date: "asc" } } },
    });
    return NextResponse.json(serialize(job));
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.jobApplication.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
