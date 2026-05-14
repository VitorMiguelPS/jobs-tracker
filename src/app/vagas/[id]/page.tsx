"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  ExternalLink,
  Calendar,
  Pencil,
  Trash2,
  RefreshCw,
  Briefcase,
} from "lucide-react";
import { JobApplication, JobStatus } from "@/types";
import { getJobById, updateJobStatus, deleteJob } from "@/lib/storage";
import { StatusBadge } from "@/components/StatusBadge";
import { CompanyAvatar } from "@/components/CompanyAvatar";
import { StageTimeline } from "@/components/StageTimeline";
import { UpdateStageModal } from "@/components/UpdateStageModal";
import { formatDate } from "@/lib/utils";

const MODALITY_LABELS = {
  presencial: "Presencial",
  remoto: "Remoto",
  hibrido: "Híbrido",
};

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<JobApplication | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    getJobById(id).then((found) => {
      if (!found) { router.replace("/vagas"); return; }
      setJob(found);
    });
  }, [id, router]);

  async function handleUpdateStage(newStatus: JobStatus, notes: string) {
    if (!job) return;
    const updated = await updateJobStatus(job.id, newStatus, notes || undefined);
    if (updated) setJob(updated);
    setShowUpdateModal(false);
  }

  async function handleDelete() {
    if (!job) return;
    await deleteJob(job.id);
    router.push("/vagas");
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  const isFinished = ["aceito", "rejeitado", "desistencia"].includes(job.status);

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/vagas"
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-gray-500 dark:text-slate-400"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-sm text-gray-400 dark:text-slate-500">Voltar para vagas</span>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
          <div className="flex items-start gap-4">
            <CompanyAvatar company={job.company} size="lg" />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">{job.position}</h1>
                  <p className="text-gray-500 dark:text-slate-400 font-medium mt-0.5">{job.company}</p>
                </div>
                <StatusBadge status={job.status} />
              </div>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {job.location && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                )}
                {job.modality && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400">
                    <Briefcase className="w-4 h-4" />
                    {MODALITY_LABELS[job.modality]}
                  </span>
                )}
                {job.salary && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400">
                    <DollarSign className="w-4 h-4" />
                    {job.salary}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400">
                  <Calendar className="w-4 h-4" />
                  Candidatado em {formatDate(job.appliedAt)}
                </span>
              </div>

              {job.url && (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ver anúncio da vaga
                </a>
              )}

              {job.tags && job.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {job.notes && (
            <div className="mt-5 pt-5 border-t border-gray-100 dark:border-slate-700">
              <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Observações</p>
              <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                {job.notes}
              </p>
            </div>
          )}

          <div className="mt-5 pt-5 border-t border-gray-100 dark:border-slate-700 flex gap-3">
            {!isFinished && (
              <button
                onClick={() => setShowUpdateModal(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm flex-1 justify-center"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar etapa
              </button>
            )}
            <Link
              href={`/vagas/${job.id}/editar`}
              className="flex items-center gap-2 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors justify-center"
            >
              <Pencil className="w-4 h-4" />
              Editar
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors justify-center"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
          <StageTimeline job={job} />
        </div>
      </div>

      {showUpdateModal && (
        <UpdateStageModal
          currentStatus={job.status}
          onConfirm={handleUpdateStage}
          onClose={() => setShowUpdateModal(false)}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-2">Excluir candidatura</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
              Tem certeza? Isso removerá <strong>{job.position}</strong> em{" "}
              <strong>{job.company}</strong> e todo o histórico de etapas.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
