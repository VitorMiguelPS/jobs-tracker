# JobTracker

Aplicação web para registrar e acompanhar candidaturas de emprego. Registre cada vaga, avance as etapas do processo seletivo e tenha uma visão clara de onde você está em cada oportunidade.

## Funcionalidades

- **Dashboard** com resumo de candidaturas por status (em andamento, propostas, aceitos, rejeitados)
- **Cadastro de vagas** com empresa, cargo, localização, modalidade, salário e link da vaga
- **Pipeline visual** de etapas: Candidatado → Triagem → Entrevista RH → Entrevista Técnica → Teste → Proposta → Aceito
- **Histórico de etapas** com data e observações por etapa
- **Tags** para classificar vagas (ex: React, Remoto, Startup)
- **Busca e filtros** por empresa, cargo, cidade ou status
- **Edição e exclusão** de candidaturas
- **Banco de dados local** — dados salvos em SQLite, persistem independente do navegador

## Tecnologias

- [Next.js 16](https://nextjs.org/) — App Router + Turbopack
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Prisma 7](https://www.prisma.io/) — ORM com SQLite via `better-sqlite3`
- [Lucide React](https://lucide.dev/) — ícones
- [date-fns](https://date-fns.org/) — formatação de datas em pt-BR

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior

## Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/jobs-tracker.git
cd jobs-tracker

# Instale as dependências
npm install

# Crie o banco de dados
npx prisma migrate dev --name init

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Scripts disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Inicia o servidor de produção
npm run lint     # Verifica o código com ESLint
```

```bash
# Comandos Prisma
npx prisma studio          # Interface visual do banco de dados
npx prisma migrate dev     # Aplica mudanças no schema
npx prisma generate        # Regenera o cliente TypeScript
```

## Estrutura do projeto

```
src/
  app/
    api/vagas/          # Rotas de API REST
    page.tsx            # Dashboard
    vagas/              # Páginas de candidaturas
  components/           # Componentes reutilizáveis
  lib/
    db.ts               # Cliente Prisma
    storage.ts          # Funções de acesso à API
    utils.ts            # Utilitários
  types/index.ts        # Tipos e configurações de status
prisma/
  schema.prisma         # Schema do banco de dados
  dev.db                # Banco SQLite (gerado localmente)
```

## Backup dos dados

Os dados ficam salvos no arquivo `prisma/dev.db`. Para fazer backup, basta copiar esse arquivo. Para restaurar, substitua o arquivo e reinicie o servidor.

> O arquivo `dev.db` está no `.gitignore` — seus dados não vão para o repositório.

## Etapas do processo seletivo

| Etapa | Descrição |
|---|---|
| Candidatado | Aplicação enviada |
| Triagem | Análise de currículo/perfil |
| Entrevista RH | Conversa com recrutador |
| Entrevista Técnica | Entrevista com time técnico |
| Teste/Desafio | Avaliação técnica prática |
| Proposta Recebida | Oferta de emprego recebida |
| Aceito | Proposta aceita |
| Rejeitado | Processo encerrado sem oferta |
| Desistência | Candidatura retirada |

## Licença

MIT
