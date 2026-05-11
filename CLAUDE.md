# JobTracker

Aplicação Next.js para registrar e acompanhar candidaturas de emprego.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4**
- **Prisma 7** com **SQLite** (`better-sqlite3` adapter)
- **Lucide React** (ícones)
- **date-fns** (formatação de datas em pt-BR)

## Como rodar

```powershell
# O Node.js não está no PATH por padrão — adicionar antes de rodar
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

npm run dev   # http://localhost:3000
```

Ou usar o atalho na raiz: `.\iniciar.ps1`

## Estrutura do projeto

```
src/
  app/
    api/vagas/              # API REST (servidor)
      route.ts              # GET /api/vagas, POST /api/vagas
      [id]/route.ts         # GET, PUT, DELETE /api/vagas/:id
      [id]/stage/route.ts   # POST /api/vagas/:id/stage
    page.tsx                # Dashboard
    vagas/
      page.tsx              # Lista de candidaturas
      nova/page.tsx         # Formulário de nova vaga
      [id]/page.tsx         # Detalhe da vaga
      [id]/editar/page.tsx  # Edição da vaga
  components/               # Componentes reutilizáveis
  lib/
    db.ts                   # Cliente Prisma (singleton)
    storage.ts              # Funções cliente que chamam a API via fetch()
    utils.ts                # Helpers (cn, formatDate, getInitials...)
  types/index.ts            # Tipos TypeScript + STATUS_CONFIG
  generated/prisma/         # Cliente gerado pelo Prisma (não editar)
prisma/
  schema.prisma             # Schema do banco
  dev.db                    # Banco SQLite (dados reais ficam aqui)
```

## Banco de dados

- Arquivo: `dev.db` na raiz do projeto
- **Backup**: copiar o arquivo `dev.db`
- Migrations ficam em `prisma/migrations/`

### Schema Prisma

```prisma
model JobApplication {
  id        String       @id @default(cuid())
  company   String
  position  String
  location  String?
  url       String?
  salary    String?
  modality  String?      # "presencial" | "remoto" | "hibrido"
  status    String       # ver JobStatus em src/types/index.ts
  notes     String?
  tags      String       @default("[]")   # JSON array serializado
  appliedAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt
  stages    StageEntry[]
}

model StageEntry {
  id     String         @id @default(cuid())
  status String
  date   DateTime       @default(now())
  notes  String?
  jobId  String
  job    JobApplication @relation(fields: [jobId], references: [id], onDelete: Cascade)
}
```

> O campo `tags` é um array JSON serializado como string (SQLite não suporta arrays nativos).

## Status das candidaturas

Definidos em `src/types/index.ts` como `JobStatus`:

| Valor | Label |
|---|---|
| `candidatado` | Candidatado |
| `triagem` | Triagem |
| `entrevista_rh` | Entrevista RH |
| `entrevista_tecnica` | Entrevista Técnica |
| `teste` | Teste/Desafio |
| `proposta` | Proposta Recebida |
| `aceito` | Aceito |
| `rejeitado` | Rejeitado |
| `desistencia` | Desistência |

`PIPELINE_STATUSES` = os 7 primeiros (usados no StageTimeline visual).
`TERMINAL_STATUSES` = `aceito`, `rejeitado`, `desistencia`.

## Comandos Prisma

```powershell
# Após alterar o schema, criar nova migration
npx prisma migrate dev --name <nome-da-mudanca>

# Regenerar o cliente TypeScript
npx prisma generate

# Visualizar o banco no browser
npx prisma studio
```

## Fluxo de dados

```
Página (use client)
  → src/lib/storage.ts (fetch)
    → /api/vagas/* (Next.js API Route)
      → src/lib/db.ts (PrismaClient)
        → dev.db (SQLite)
```

## Decisões de arquitetura

- **localStorage → SQLite**: migrado para persistência real que não depende do browser
- **Adapter better-sqlite3**: Prisma 7 exige driver adapter para SQLite (não aceita mais `url` no schema)
- **Tags como JSON string**: serialização manual no campo `tags` pois SQLite não tem tipo array
- **Singleton Prisma**: padrão `globalThis` para evitar múltiplas conexões em hot-reload do dev
