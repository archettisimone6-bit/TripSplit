# TripSplit HR

Piattaforma interna per la gestione del processo di selezione: posizioni
aperte, anagrafica candidati, candidature e avanzamento nella pipeline di
assunzione.

## Funzionalità

- **Modulo di autocandidatura pubblico** (`/candidatura`, nessun login
  richiesto) — pagina volutamente essenziale, pensata per chi non ha
  dimestichezza con il computer: pochi campi grandi, un solo bottone,
  nessun gergo tecnico. Il candidato inserisce da solo i propri dati e,
  se lo sceglie lo staff, la posizione può essere già preselezionata
  condividendo il link dedicato mostrato nella pagina di ogni posizione
  (o quello generico in dashboard). L'invio crea automaticamente il
  candidato e la candidatura, gestendo in modo trasparente eventuali
  invii doppi.
- **Autenticazione staff** — accesso protetto con sessione via cookie
  firmato per l'area interna di gestione.
- **Posizioni aperte** — creazione, modifica ed eliminazione di annunci
  (titolo, dipartimento, sede, tipo di contratto, stato, descrizione).
- **Candidati** — anagrafica con contatti, fonte di provenienza (incluse
  le autocandidature) e ricerca per nome/email.
- **Candidature** — collegamento candidato ↔ posizione (o "candidatura
  spontanea" senza posizione specifica), con vincolo che impedisce
  duplicati sulla stessa posizione.
- **Pipeline** — board in stile kanban con le fasi Candidatura ricevuta →
  Screening CV → Colloquio → Offerta inviata → Assunto/Rifiutato,
  filtrabile per posizione, con avanzamento di fase con un click.
- **Note e attività** — timeline per ogni candidatura che unisce note
  scritte dallo staff e voci automatiche (candidatura creata, cambi di
  fase), oltre a una valutazione a stelle (1-5). Questa è la sezione dove
  si tiene traccia di tutto ciò che riguarda un singolo candidato.
- **Questionario conoscitivo** (`/questionario/[id]`, nessun login
  richiesto) — secondo modulo, opzionale e più approfondito del primo,
  condivisibile con un link dedicato dalla pagina di ogni candidatura
  (interessi, hobby, paesi visitati, abilità manuali, disponibilità,
  patente, lingue, esperienze pregresse, motivazione). Non chiede dati
  sanitari (fumo, sostanze): sono esclusi di proposito perché la loro
  raccolta in fase di selezione è vietata dall'art. 8 dello Statuto dei
  Lavoratori ed è "dato relativo alla salute" ai sensi del GDPR (art. 9).
- **Dashboard** — conteggi di posizioni aperte, candidati, candidature per
  fase e attività recente.

## Stack tecnico

- [Next.js 16](https://nextjs.org/) (App Router, Server Components, Server
  Actions)
- [Prisma ORM 7](https://www.prisma.io/) con driver adapter
  `@prisma/adapter-better-sqlite3` su SQLite
- Tailwind CSS 4
- Sessione di autenticazione custom (cookie HttpOnly firmato con HMAC via
  `node:crypto`), password con `bcryptjs`

> Nota: questo progetto usa Next.js 16, che introduce differenze rilevanti
> rispetto alle versioni precedenti (vedi `AGENTS.md` nella root del
> progetto). Il modello di cache "Cache Components" **non** è abilitato:
> tutte le pagine sono renderizzate dinamicamente ad ogni richiesta, come
> nel modello di rendering classico dell'App Router.

## Avvio in locale

```bash
npm install

# crea il database SQLite e applica le migration
npm run db:migrate

# genera il Prisma Client
npm run db:generate

# popola il database con un utente admin e dati demo
npm run db:seed

npm run dev
```

L'app sarà disponibile su `http://localhost:3000`. Le credenziali
dell'utente admin seminato sono definite in `.env`
(`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`, di default
`admin@tripsplit-hr.dev` / `admin1234`).

Copia `.env.example` in `.env` e personalizza `AUTH_SECRET` prima di
qualunque deploy reale.

## Struttura del progetto

```text
hr-platform/
├── prisma/
│   ├── schema.prisma       Modelli dati (User, JobPosition, Candidate, Application, Note, CandidateProfile)
│   ├── migrations/         Migration SQL generate da Prisma
│   └── seed.ts             Script di seed (utente admin + dati demo)
├── src/
│   ├── app/
│   │   ├── candidatura/    Modulo pubblico di autocandidatura (no login)
│   │   ├── questionario/   Questionario conoscitivo per candidatura (no login)
│   │   ├── (auth)/login/   Pagina e Server Action di login staff
│   │   └── (app)/          Sezione autenticata: dashboard, posizioni,
│   │                       candidati, pipeline, candidature
│   ├── components/         Componenti UI condivisi (nav, badge, ecc.)
│   ├── lib/                Prisma client, sessione/auth, costanti dominio
│   └── generated/prisma/   Prisma Client generato (non versionato)
└── package.json
```

## Script disponibili

| Script              | Descrizione                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`        | Avvia il server di sviluppo                   |
| `npm run build`      | Build di produzione                           |
| `npm run start`      | Avvia il build di produzione                  |
| `npm run lint`       | Esegue ESLint                                 |
| `npm run db:migrate` | Crea/applica le migration Prisma in sviluppo  |
| `npm run db:generate`| Rigenera il Prisma Client                     |
| `npm run db:seed`    | Popola il database con i dati demo            |
| `npm run db:studio`  | Apre Prisma Studio per ispezionare i dati     |

## Possibili estensioni future

- Ruoli e permessi più granulari (oggi esiste solo `ADMIN`/`RECRUITER` come
  campo dati, senza differenze di autorizzazione applicate).
- Caricamento CV/allegati (oggi si registra solo un link LinkedIn).
- Notifiche via email sui cambi di fase.
- Passaggio a PostgreSQL per un deploy multi-istanza (basta cambiare
  `datasource` in `prisma/schema.prisma` e il driver adapter).
