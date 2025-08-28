# BeePulse — project\_rules.md

> **Objetivo do documento**: padronizar como construímos, operamos e evoluímos o BeePulse (diagnóstico de performance digital para hotelaria) — garantindo qualidade, consistência visual Omnibees, dados **reais** (sem mocks) e paridade **Página ⇄ PDF**.

---

## 1) Escopo e princípios

* **Sem prometer IA**. O valor é a **inteligência de mercado** da Omnibees aplicada a diagnósticos reais.
* **Dados sempre reais** (PSI/CrUX/Security/RDAP/DoH). Se indisponível, degradar graciosamente e **explicar no relatório**.
* **Uma verdade só**: `analysisSnapshot` é o **contrato único** que alimenta **UI e PDF** (mesmos números, textos e estados).
* **Tempo de insight**: primeiro byte visível em < 3s; primeira nota útil < 6s (com placeholders de carregamento).
* **LGPD by design**: captamos o mínimo necessário; transparência e exclusão sob solicitação.

---

## 2) Stack e arquitetura (MVP)

* **Frontend**: Next.js + Tailwind (Vercel). Components desacoplados (Hero, DomainInput, ScorePreview, ReportPage, PDFRenderer).
* **Back**: Next.js API Routes (Server Actions opcionais).
* **Banco**: Supabase (Postgres + Storage).
* **CRM**: Salesforce (OAuth2, REST /sobjects/Lead).
* **Email**: MailerSend (templates + tracking).
* **Análises externas**: Google PSI + CrUX, Safe Browsing v5, Qualys SSL Labs, Mozilla Observatory v2, RDAP (via IANA + fallbacks), DNS over HTTPS (Google/Cloudflare).

---

## 3) Estrutura de pastas (sugestão)

```
apps/web
  /app
    /(marketing) -> LP (Sprint 1)
    /(report)    -> relatório (Sprints 2–3)
    /api         -> integrações externas e CRM/email (Sprint 4)
  /components   -> UI atômica (Cards, Badges, Charts, Tables)
  /lib          -> clientes externos (psi, crux, ssl, observatory, rdap, doh)
  /pdf          -> templates e layout do PDF
  /styles       -> tokens de marca (cores, espaçamentos)
```

---

## 4) Modelo de dados (Supabase)

### 4.1 Tabelas

```sql
-- Leads captados pela LP
create table if not exists leads_beepulse (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  phone text,
  hotel_name text,
  site_url text not null,
  score_basico jsonb,     -- Sprint 2: PSI básico
  salesforce_id text,      -- Sprint 4
  email_sent boolean default false
);

-- Análises por domínio (snapshot imutável)
create table if not exists analises (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  lead_id uuid references leads_beepulse(id) on delete set null,
  site_url text not null,
  analysis_snapshot jsonb not null,  -- contrato único descrito abaixo
  be_pulse_score int not null
);

-- PDFs gerados
create table if not exists reports_beepulse (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  analise_id uuid references analises(id) on delete cascade,
  pdf_url text not null,
  bytes int
);
```

### 4.2 Índices recomendados

```sql
create index on analises (site_url, created_at desc);
create index on leads_beepulse (created_at desc);
```

---

## 5) `analysisSnapshot` — contrato único (UI ⇄ PDF)

```json
{
  "meta": { "siteUrl": "https://exemplo.com", "analyzedAtISO": "2025-08-28T18:00:00Z", "beePulseScore": 78 },
  "psi": {
    "performance": 81,
    "seo": 74,
    "accessibility": 90,
    "bestPractices": 86,
    "topOpportunities": ["Serve images in next-gen formats", "Reduce JS execution time"]
  },
  "crux": {
    "mobile": { "lcp": {"p75": 2.9, "goodPct": 78}, "cls": {"p75": 0.09, "goodPct": 85}, "inp": {"p75": 190, "goodPct": 76}, "fcp": {"p75": 1.6, "goodPct": 82}, "ttfb": {"p75": 0.4, "goodPct": 69} },
    "desktop": { "lcp": {"p75": 1.8, "goodPct": 92}, "cls": {"p75": 0.03, "goodPct": 96}, "inp": {"p75": 80, "goodPct": 94}, "fcp": {"p75": 0.9, "goodPct": 91}, "ttfb": {"p75": 0.2, "goodPct": 88} }
  },
  "security": {
    "safeBrowsing": "OK",               
    "sslLabsGrade": "A",
    "observatoryGrade": "B",
    "missingHeaders": ["Content-Security-Policy", "Strict-Transport-Security"]
  },
  "domain": { "registrar": null, "createdAt": "2016-03-01T00:00:00Z", "expiresAt": "2027-03-01T00:00:00Z", "ageYears": 9 },
  "dns": { "aRecordsCount": 2, "hasMX": true, "hasNS": true, "inferredCDN": "Cloudflare", "dohLatencyMs": 38 },
  "recommendations": [
    { "area": "checkout", "message": "Tempo de checkout acima da média; otimizar e reduzir JS pesado.", "omniLink": "https://omnibees.com/beedirect" },
    { "area": "pagamentos", "message": "Adicionar PIX para reduzir abandono.", "omniLink": "https://omnibees.com/bee2pay" }
  ],
  "notes": { "missingDataFlags": [], "sourceErrors": [] }
}
```

> **Regra**: UI e PDF **consomem** o mesmo objeto. Se um campo não existir, a seção correspondente é renderizada como “Dados indisponíveis (origem sem resposta)”.

---

## 6) Cálculo do BeePulse Score

* **Base (60%)**: Lighthouse → Performance (35), SEO (15), Best Practices (5), Accessibility (5).
* **Experiência real (25%)**: CrUX (priorize **mobile**). ≥75% “bons” em LCP/CLS/INP → score cheio; abaixo disso, escala linear.
* **Segurança (15%)**: SSL Labs (10) + Observatory (5). Safe Browsing "AT\_RISK" zera este bloco.
* **Sem CrUX**: redistribuir +10% para Base; manter 15% para Segurança.

---

## 7) Integrações externas (regras operacionais)

* **PSI (Lighthouse)**: key `GOOGLE_API_KEY`; cache 12h; timeout 12s.
* **CrUX**: key `GOOGLE_API_KEY`; cache 12h; timeout 6s; tratar ausência de amostra.
* **Safe Browsing v5**: key `SAFE_BROWSING_API_KEY`; timeout 3s; se risco, marcar `AT_RISK`.
* **SSL Labs**: timeout 25s; aceitar resultados em cache.
* **Mozilla Observatory v2**: respeitar 1 scan/min/host; retry 502 com backoff (1.5s → 4s → 8s); cache 24h.
* **RDAP**: bootstrapping IANA (`dns.json`) → registry; fallbacks: `rdap.org`, `rdap.net`, TLDs (.br, .com/.net). Timeout 5s, 2 retries; cache 24h.
* **DNS over HTTPS (Google/Cloudflare)**: A/AAAA, MX, NS, CNAME; timeout 2s; cache 24h.

> **Falhas**: nunca quebrar relatório. Marcar `notes.sourceErrors[]` e normalizar pesos do score.

---

## 8) Identidade Visual (Página & PDF)

* **Cores**: Bee Yellow `#FFD200`, Bee Black `#1A1A1A`, White `#FFFFFF`, Gray Light `#F5F5F5`, Gray Mid `#999999`.
* **Semânticas**: Sucesso `#00A650`, Alerta `#FFB300`, Atenção `#FF8A00`, Risco `#E53935`.
* **PDF**: capa forte, cards, badges, barras robustas, zebra em tabelas, ícones outline.
* **Regra de paridade**: qualquer número/nota na página **deve** aparecer idêntico no PDF.

---

## 9) Variáveis de ambiente (.env.example)

```dotenv
# Google
GOOGLE_API_KEY=

# Safe Browsing
SAFE_BROWSING_API_KEY=

# Salesforce (OAuth2)
SALESFORCE_CLIENT_ID=
SALESFORCE_CLIENT_SECRET=
SALESFORCE_INSTANCE_URL=
SALESFORCE_REFRESH_TOKEN=

# MailerSend
MAILERSEND_API_KEY=
MAILERSEND_TEMPLATE_ID_LEAD=
MAILERSEND_FROM_EMAIL=
MAILERSEND_FROM_NAME=BeePulse · Omnibees

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

* **Nunca** commitar `.env`. Manter `.env.example` atualizado.

---

## 10) Integração Salesforce (Sprint 4)

* Criar Lead em `/sobjects/Lead` com: FirstName, LastName, Email, Phone, Company = `Hotel <hotel_name>`, Website = `site_url`.
* Custom fields: `Score_BeePulse__c`, `Relatorio_BeePulse_URL__c`.
* **Status inicial**: “Novo Lead – BeePulse”.
* Reprocessar em caso de 401 (refresh token). Logar `salesforce_id` no lead.

---

## 11) Email MailerSend (Sprint 4)

* Template com placeholders: `{{nome}}`, `{{link_relatorio}}`.
* Assunto: “Seu Diagnóstico Digital – BeePulse Omnibees”.
* Envio após geração do PDF; registrar `email_sent = true`.

---

## 12) Caching, rate limits e timeouts

* PSI/CrUX 12h · SSL/Observatory 24h · RDAP/DoH 24h.
* Timeouts: 12s (PSI), 6s (CrUX), 3s (SB), 25s (SSL), 12s (Obs), 5s (RDAP), 2s (DoH).
* Retries: Observatory 5xx com backoff; RDAP 2 tentativas por camada.

---

## 13) Tratamento de erros e observabilidade

* **Logs estruturados** (JSON): `event`, `site_url`, `service`, `latency_ms`, `status`, `error_code`.
* **Sem PII** em logs (redigir email/telefone).
* **Dash**: métricas de sucesso por serviço, taxas de timeout, % relatórios com dados completos.

---

## 14) Privacidade & LGPD

* Base legal: **consentimento** no formulário (LP) e **interesse legítimo** para contato comercial.
* PII mínima: nome, email, telefone, hotel.
* **Retenção**: leads e relatórios por 24 meses (revisão semestral). Exclusão mediante solicitação.

---

## 15) Analytics & eventos (interno)

* `lp_view`, `lp_submit_lead`, `analyze_start`, `analyze_success`, `report_view`, `pdf_generated`, `email_sent`, `crm_sent`.
* Dimensões: `site_url`, `region`, `device`.

---

## 16) Feature flags e configuração

* `enable.crux`, `enable.ssl`, `enable.observatory`, `enable.rdap`, `enable.doh`, `enable.salesforce`, `enable.mailersend`.
* Flags lidas no servidor (para evitar UI inconsistente).

---

## 17) QA — critérios de aceite por sprint

* **Sprint 1**: LP responsiva; lead salvo; design Omnibees.
* **Sprint 2**: Input domínio; PSI real; score básico; CTA para relatório completo.
* **Sprint 3**: Relatório avançado; PDF gerado; **paridade UI⇄PDF**.
* **Sprint 4**: Lead no Salesforce; email MailerSend com link do PDF; histórico persistido.

---

## 18) Processo de release

* **Branching**: `main` (prod), `develop` (staging), `feat/*` (sprints).
* PR com checklist: acessibilidade, estados de erro, paridade UI⇄PDF, performance.
* CI: lint, type-check, testes, preview.
* CD: Vercel (staging → prod com tag).

---

## 19) Runbook (operacional)

* Falha PSI/CrUX: checar quota/chave; reduzir concorrência; aumentar cache.
* Observatory 502: confirmar retry/backoff; respeitar cooldown 1 min/host.
* RDAP sem resposta: verificar IANA `dns.json`; testar `rdap.org`/`rdap.net`; conferir TLD.
* SSL Labs lento: aceitar resultado em cache; evitar re-scan em sequência.
* Salesforce 401: renovar token; reprocessar fila de leads pendentes.
* MailerSend 4xx/5xx: re-enfileirar, notificar operações.

---

## 20) Próximos passos (quando retomarmos o Sprint 5)

* Histórico do hotel (gráficos evolução) + benchmark regional anônimo.
* Export “Relatório Evolução” em PDF.
* White-label para parceiros.
