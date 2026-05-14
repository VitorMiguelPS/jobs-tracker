"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, Filter, X } from "lucide-react";
import { JobApplication, JobStatus, STATUS_CONFIG } from "@/types";
import { getJobs } from "@/lib/storage";
import { JobCard } from "@/components/JobCard";

const FILTER_GROUPS: { label: string; statuses: JobStatus[] }[] = [
  { label: "Todas", statuses: [] },
  { label: "Em andamento", statuses: ["candidatado", "triagem", "entrevista_rh", "entrevista_tecnica", "teste"] },
  { label: "Proposta", statuses: ["proposta"] },
  { label: "Aceito", statuses: ["aceito"] },
  { label: "Rejeitado", statuses: ["rejeitado"] },
  { label: "Desistência", statuses: ["desistencia"] },
];

export default function VagasPage() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState(0);

  useEffect(() => {
    getJobs().then(setJobs);
  }, []);

  const filtered = useMemo(() => {
    let result = [...jobs];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (j) =>
          j.company.toLowerCase().includes(q) ||
          j.position.toLowerCase().includes(q) ||
          j.location?.toLowerCase().includes(q) ||
          j.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    const group = FILTER_GROUPS[activeFilter];
    if (group.statuses.length > 0) {
      result = result.filter((j) => group.statuses.includes(j.status));
    }

    return result;
  }, [jobs, search, activeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Minhas Vagas</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">{jobs.length} candidatura{jobs.length !== 1 ? "s" : ""} registrada{jobs.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/vagas/nova"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nova vaga</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por empresa, cargo, cidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {FILTER_GROUPS.map((group, idx) => (
          <button
            key={group.label}
            onClick={() => setActiveFilter(idx)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeFilter === idx
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-700"
            }`}
          >
            {group.label}
            {group.statuses.length > 0 && (
              <span className={`ml-1.5 text-xs ${activeFilter === idx ? "text-indigo-200" : "text-gray-400 dark:text-slate-500"}`}>
                ({jobs.filter((j) => group.statuses.includes(j.status)).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          {jobs.length === 0 ? (
            <>
              <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400 dark:text-slate-500" />
              </div>
              <h3 className="font-semibold text-gray-700 dark:text-slate-300 mb-2">Nenhuma vaga ainda</h3>
              <p className="text-gray-400 dark:text-slate-500 text-sm mb-4">Adicione sua primeira candidatura</p>
              <Link
                href="/vagas/nova"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Adicionar vaga
              </Link>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400 dark:text-slate-500" />
              </div>
              <h3 className="font-semibold text-gray-700 dark:text-slate-300 mb-1">Nenhum resultado</h3>
              <p className="text-gray-400 dark:text-slate-500 text-sm">Tente buscar com outros termos ou filtros</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
