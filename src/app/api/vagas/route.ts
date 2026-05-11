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

export async function GET() {
  const jobs = await prisma.jobApplication.findMany({
    include: { stages: { orderBy: { date: "asc" } } },
    orderBy: { appliedAt: "desc" },
  });
  return NextResponse.json(jobs.map(serialize));
}

export async function POST(req: Request) {
  const body = await req.json();

  const job = await prisma.jobApplication.create({
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
      stages: {
        create: {
          status: body.status,
          notes: body.notes ?? null,
        },
      },
    },
    include: { stages: { orderBy: { date: "asc" } } },
  });

  return NextResponse.json(serialize(job), { status: 201 });
}
