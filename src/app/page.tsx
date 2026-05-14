"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  ArrowRight,
  Award,
} from "lucide-react";
import { JobApplication, STATUS_CONFIG, JobStatus } from "@/types";
import { getJobs, getStats } from "@/lib/storage";
import { StatCard } from "@/components/StatCard";
import { JobCard } from "@/components/JobCard";

const STATUS_GROUPS: { label: string; statuses: JobStatus[]; color: string }[] = [
  {
    label: "Em andamento",
    statuses: ["candidatado", "triagem", "entrevista_rh", "entrevista_tecnica", "teste"],
    color: "text-blue-600",
  },
  {
    label: "Proposta recebida",
    statuses: ["proposta"],
    color: "text-yellow-600",
  },
  {
    label: "Encerradas",
    statuses: ["aceito", "rejeitado", "desistencia", "cancelado"],
    color: "text-gray-500",
  },
];

export default function DashboardPage() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);

  useEffect(() => {
    getJobs().then(setJobs);
  }, []);

  const stats = getStats(jobs);
  const recent = jobs.slice(0, 4);

  const byStatus = STATUS_GROUPS.map((group) => ({
    ...group,
    items: jobs.filter((j) => group.statuses.includes(j.status)),
  }));

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6">
          <Briefcase className="w-10 h-10 text-indigo-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">Comece sua jornada</h1>
        <p className="text-gray-500 dark:text-slate-400 max-w-sm mb-8">
          Registre sua primeira candidatura e acompanhe cada etapa do processo seletivo.
        </p>
        <Link
          href="/vagas/nova"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Adicionar primeira vaga
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Dashboard</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">Resumo das suas candidaturas</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total de vagas"
          value={stats.total}
          icon={Briefcase}
          color="text-indigo-600"
          bgColor="bg-indigo-50"
        />
        <StatCard
          label="Em andamento"
          value={stats.active}
          icon={TrendingUp}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          label="Propostas"
          value={stats.proposta}
          icon={Award}
          color="text-yellow-600"
          bgColor="bg-yellow-50"
        />
        <StatCard
          label="Aceitos"
          value={stats.aceito}
          icon={CheckCircle}
          color="text-green-600"
          bgColor="bg-green-50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {byStatus.map((group) => (
          <div key={group.label} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-semibold ${group.color}`}>{group.label}</h3>
              <span className="text-2xl font-bold text-gray-900 dark:text-slate-100">{group.items.length}</span>
            </div>
            {group.items.length > 0 ? (
              <div className="space-y-1.5">
                {group.items.slice(0, 3).map((job) => (
                  <Link
                    key={job.id}
                    href={`/vagas/${job.id}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-slate-200 truncate group-hover:text-indigo-700 dark:group-hover:text-indigo-400">
                        {job.position}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-slate-500 truncate">{job.company}</p>
                    </div>
                    <span
                      className={`text-xs ml-2 flex-shrink-0 px-2 py-0.5 rounded-full ${STATUS_CONFIG[job.status].bg} ${STATUS_CONFIG[job.status].color}`}
                    >
                      {STATUS_CONFIG[job.status].label.split(" ")[0]}
                    </span>
                  </Link>
                ))}
                {group.items.length > 3 && (
                  <p className="text-xs text-gray-400 dark:text-slate-500 text-center pt-1">
                    +{group.items.length - 3} mais
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-2">Nenhuma</p>
            )}
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Candidaturas recentes</h2>
          <Link
            href="/vagas"
            className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors"
          >
            Ver todas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recent.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
