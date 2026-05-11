"use client";

import { useState } from "react";
import { X, ChevronRight } from "lucide-react";
import { JobStatus, STATUS_CONFIG, PIPELINE_STATUSES, TERMINAL_STATUSES } from "@/types";
import { cn } from "@/lib/utils";

interface UpdateStageModalProps {
  currentStatus: JobStatus;
  onConfirm: (status: JobStatus, notes: string) => void;
  onClose: () => void;
}

const ALL_STATUSES: JobStatus[] = [...PIPELINE_STATUSES, ...TERMINAL_STATUSES.filter(
  (s) => s !== "aceito"
)];

export function UpdateStageModal({ currentStatus, onConfirm, onClose }: UpdateStageModalProps) {
  const [selected, setSelected] = useState<JobStatus | null>(null);
  const [notes, setNotes] = useState("");

  const availableStatuses = ALL_STATUSES.filter((s) => s !== currentStatus);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Atualizar etapa</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-3">Selecione a nova etapa:</p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {availableStatuses.map((status) => {
              const cfg = STATUS_CONFIG[status];
              const isSelected = selected === status;
              return (
                <button
                  key={status}
                  onClick={() => setSelected(status)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all",
                    isSelected
                      ? `${cfg.bg} ${cfg.border} ${cfg.color}`
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <span className={cn("text-sm font-medium", isSelected ? cfg.color : "text-gray-700")}>
                    {cfg.label}
                  </span>
                  <ChevronRight className={cn("w-4 h-4", isSelected ? cfg.color : "text-gray-300")} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-5">
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            Observações <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Entrevista agendada para sexta às 14h..."
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => selected && onConfirm(selected, notes)}
            disabled={!selected}
            className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
