"use client";

import Link from "next/link";
import { MapPin, DollarSign, ExternalLink, Clock, Briefcase } from "lucide-react";
import { JobApplication } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { CompanyAvatar } from "./CompanyAvatar";
import { formatDate, formatRelative } from "@/lib/utils";

interface JobCardProps {
  job: JobApplication;
}

const MODALITY_LABELS = {
  presencial: "Presencial",
  remoto: "Remoto",
  hibrido: "Híbrido",
};

export function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/vagas/${job.id}`} className="block group">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-200 group-hover:-translate-y-0.5">
        <div className="flex items-start gap-4">
          <CompanyAvatar company={job.company} size="md" />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                  {job.position}
                </h3>
                <p className="text-sm text-gray-500 dark:text-white font-medium">{job.company}</p>
              </div>
              <StatusBadge status={job.status} size="sm" />
            </div>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
              {job.location && (
                <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-white">
                  <MapPin className="w-3.5 h-3.5" />
                  {job.location}
                </span>
              )}
              {job.modality && (
                <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-white">
                  <Briefcase className="w-3.5 h-3.5" />
                  {MODALITY_LABELS[job.modality]}
                </span>
              )}
              {job.salary && (
                <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-white">
                  <DollarSign className="w-3.5 h-3.5" />
                  {job.salary}
                </span>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-white">
                <Clock className="w-3.5 h-3.5" />
                Candidatado em {formatDate(job.appliedAt)}
              </span>
              {job.url && (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Ver vaga
                </a>
              )}
            </div>

            {job.tags && job.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-white rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-50 dark:border-slate-700 flex items-center justify-between">
          <span className="text-xs text-gray-400 dark:text-white">
            Atualizado {formatRelative(job.updatedAt)}
          </span>
          <span className="text-xs text-gray-400 dark:text-white">
            {job.stages.length} {job.stages.length === 1 ? "etapa" : "etapas"}
          </span>
        </div>
      </div>
    </Link>
  );
}
