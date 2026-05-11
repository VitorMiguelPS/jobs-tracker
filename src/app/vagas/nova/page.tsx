"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { JobStatus } from "@/types";
import { createJob } from "@/lib/storage";

const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: "candidatado", label: "Candidatado" },
  { value: "triagem", label: "Triagem" },
  { value: "entrevista_rh", label: "Entrevista RH" },
  { value: "entrevista_tecnica", label: "Entrevista Técnica" },
  { value: "teste", label: "Teste/Desafio" },
  { value: "proposta", label: "Proposta Recebida" },
];

export default function NovaVagaPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState({
    company: "",
    position: "",
    location: "",
    url: "",
    salary: "",
    modality: "" as "" | "presencial" | "remoto" | "hibrido",
    status: "candidatado" as JobStatus,
    notes: "",
    tags: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.company.trim()) errs.company = "Empresa é obrigatória";
    if (!form.position.trim()) errs.position = "Cargo é obrigatório";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    const job = await createJob({
      company: form.company.trim(),
      position: form.position.trim(),
      location: form.location.trim() || undefined,
      url: form.url.trim() || undefined,
      salary: form.salary.trim() || undefined,
      modality: form.modality || undefined,
      status: form.status,
      notes: form.notes.trim() || undefined,
      tags: form.tags,
    });
    router.push(`/vagas/${job.id}`);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/vagas"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova candidatura</h1>
          <p className="text-gray-500 text-sm">Registre uma nova vaga de emprego</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
          <h2 className="font-semibold text-gray-800">Informações da vaga</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Empresa <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                placeholder="Ex: Google, Nubank..."
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent ${
                  errors.company ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
              />
              {errors.company && (
                <p className="text-xs text-red-500 mt-1">{errors.company}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Cargo <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.position}
                onChange={(e) => set("position", e.target.value)}
                placeholder="Ex: Desenvolvedor Frontend..."
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent ${
                  errors.position ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
              />
              {errors.position && (
                <p className="text-xs text-red-500 mt-1">{errors.position}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Localização</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="Ex: São Paulo, SP"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Modalidade</label>
              <select
                value={form.modality}
                onChange={(e) => set("modality", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent bg-white"
              >
                <option value="">Não informado</option>
                <option value="presencial">Presencial</option>
                <option value="remoto">Remoto</option>
                <option value="hibrido">Híbrido</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Faixa salarial
              </label>
              <input
                type="text"
                value={form.salary}
                onChange={(e) => set("salary", e.target.value)}
                placeholder="Ex: R$ 8.000 - 12.000"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Etapa atual
              </label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent bg-white"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Link da vaga
            </label>
            <input
              type="url"
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
          <h2 className="font-semibold text-gray-800">Detalhes adicionais</h2>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Observações iniciais
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Anotações sobre a vaga, contato recrutador, pontos de atenção..."
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Ex: React, Remoto, Startup..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addTag}
                className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-indigo-900"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/vagas"
            className="flex-1 text-center px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-60 shadow-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? "Salvando..." : "Salvar candidatura"}
          </button>
        </div>
      </form>
    </div>
  );
}
