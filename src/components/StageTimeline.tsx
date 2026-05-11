"use client";

import { CheckCircle, Circle } from "lucide-react";
import { JobApplication, PIPELINE_STATUSES, STATUS_CONFIG, JobStatus } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface StageTimelineProps {
  job: JobApplication;
}

export function StageTimeline({ job }: StageTimelineProps) {
  const isTerminal = ["aceito", "rejeitado", "desistencia"].includes(job.status);
  const lastStageInPipeline = isTerminal
    ? job.stages.findLast((s) => PIPELINE_STATUSES.includes(s.status))?.status
    : job.status;

  const currentPipelineIdx = lastStageInPipeline
    ? PIPELINE_STATUSES.indexOf(lastStageInPipeline as JobStatus)
    : -1;

  const stageMap = new Map(job.stages.map((s) => [s.status, s]));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Pipeline de etapas</h3>
        <div className="flex items-center gap-0">
          {PIPELINE_STATUSES.map((status, idx) => {
            const cfg = STATUS_CONFIG[status];
            const reached = idx <= currentPipelineIdx;
            const isCurrent = status === job.status;

            return (
              <div key={status} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                      reached
                        ? `${cfg.bg} ${cfg.border} ${cfg.color}`
                        : "bg-gray-50 border-gray-200 text-gray-400",
                      isCurrent && "ring-2 ring-offset-2 ring-indigo-400"
                    )}
                  >
                    {reached ? (
                      idx < currentPipelineIdx ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        idx + 1
                      )
                    ) : (
                      <Circle className="w-4 h-4 opacity-40" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs text-center w-16 leading-tight",
                      reached ? "text-gray-700 font-medium" : "text-gray-400"
                    )}
                  >
                    {cfg.label.split(" ")[0]}
                  </span>
                </div>
                {idx < PIPELINE_STATUSES.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mb-5",
                      idx < currentPipelineIdx ? "bg-indigo-300" : "bg-gray-200"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {isTerminal && (
          <div
            className={cn(
              "mt-4 px-4 py-3 rounded-xl border text-sm font-medium",
              STATUS_CONFIG[job.status].bg,
              STATUS_CONFIG[job.status].border,
              STATUS_CONFIG[job.status].color
            )}
          >
            Resultado final: {STATUS_CONFIG[job.status].label}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Histórico de etapas</h3>
        <div className="space-y-3">
          {[...job.stages].reverse().map((stage, idx) => {
            const cfg = STATUS_CONFIG[stage.status];
            const isLatest = idx === 0;
            return (
              <div
                key={stage.id}
                className={cn(
                  "flex gap-3 p-3 rounded-xl border transition-all",
                  isLatest ? `${cfg.bg} ${cfg.border}` : "bg-gray-50 border-gray-100"
                )}
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                    isLatest ? cfg.color.replace("text-", "bg-") : "bg-gray-300"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isLatest ? cfg.color : "text-gray-600"
                      )}
                    >
                      {cfg.label}
                    </span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {formatDateTime(stage.date)}
                    </span>
                  </div>
                  {stage.notes && (
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      {stage.notes}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
