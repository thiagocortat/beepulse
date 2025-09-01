# BeePulse - Análise de Performance Web para Hotelaria

BeePulse é uma plataforma avançada de análise de performance web desenvolvida pela Omnibees, especializada em avaliar sites de hotéis e pousadas com foco em conversão de reservas e experiência do usuário.

## 🚀 Funcionalidades

- **Análise Completa de Performance**: PageSpeed Insights, Core Web Vitals, SEO e Acessibilidade
- **BeePulse Score**: Sistema proprietário de pontuação (Base 60% + Experiência Real 25% + Segurança 15%)
- **Dados Reais de Usuários**: Integração com Chrome UX Report (CrUX)
- **Análise de Segurança**: Safe Browsing, SSL Labs e Mozilla Observatory
- **Informações de Domínio**: RDAP, DNS over HTTPS e análise de infraestrutura
- **Recomendações Personalizadas**: Engine de recomendações Omnibees
- **Relatórios em PDF**: Geração automática de relatórios profissionais
- **Sistema de Cache Inteligente**: Cache por domínio com TTL otimizado

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, APIs RESTful
- **Banco de Dados**: Supabase (PostgreSQL)
- **Integrações**: Google APIs, SSL Labs, Mozilla Observatory
- **PDF**: jsPDF para geração de relatórios

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase
- Chaves de API do Google (PageSpeed Insights, Safe Browsing)

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone <repository-url>
cd beepulse
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica-anonima

# Google APIs
GOOGLE_API_KEY=sua-chave-google-api
SAFE_BROWSING_API_KEY=sua-chave-safe-browsing

# Salesforce Integration (Webhook)
SALESFORCE_WEBHOOK_URL=https://your-webhook-url.com/salesforce

# MailerSend (opcional)
MAILERSEND_API_TOKEN=seu-token-mailersend
```

### 4. Configure o Supabase

1. Siga as instruções em [`supabase/README.md`](./supabase/README.md)
2. Execute o schema SQL: [`supabase/schema.sql`](./supabase/schema.sql)
3. (Opcional) Execute os dados de exemplo: [`supabase/seed.sql`](./supabase/seed.sql)

### 5. Execute o projeto
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação.

## 📁 Estrutura do Projeto

```
beepulse/
├── src/
│   ├── app/                 # App Router (Next.js 13+)
│   ├── components/          # Componentes React
│   │   ├── report/         # Componentes do relatório
│   │   └── ...
│   ├── lib/                # Utilitários e configurações
│   │   ├── analysis.ts     # Engine principal de análise
│   │   ├── cache.ts        # Sistema de cache
│   │   ├── supabase.ts     # Cliente Supabase
│   │   └── ...
│   ├── pages/              # Pages Router (APIs)
│   │   └── api/           # Endpoints da API
│   └── types/             # Definições TypeScript
├── supabase/              # Configuração do banco
│   ├── schema.sql         # Schema das tabelas
│   ├── seed.sql          # Dados de exemplo
│   └── README.md         # Guia de configuração
└── public/               # Arquivos estáticos
```

## 🔧 APIs Utilizadas

- **Google PageSpeed Insights**: Análise de performance
- **Chrome UX Report (CrUX)**: Dados reais de usuários
- **Google Safe Browsing**: Verificação de segurança
- **SSL Labs**: Análise de certificados SSL
- **Mozilla Observatory**: Análise de headers de segurança
- **RDAP**: Informações de domínio
- **DNS over HTTPS**: Resolução DNS segura

## 📊 Sistema de Pontuação BeePulse

O BeePulse Score é calculado com base em:

- **60% Base**: Média ponderada de Performance, SEO, Acessibilidade e Boas Práticas
- **25% Experiência Real**: Dados do Chrome UX Report (Core Web Vitals)
- **15% Segurança**: Safe Browsing, SSL Labs e Mozilla Observatory

## 🔄 Sistema de Cache

- **PageSpeed Insights**: 6 horas
- **CrUX**: 24 horas
- **Safe Browsing**: 12 horas
- **SSL Labs**: 24 horas
- **Observatory**: 24 horas
- **RDAP**: 7 dias
- **DNS**: 1 hora

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras Plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## 🧪 Desenvolvimento

### Executar em modo de desenvolvimento
```bash
npm run dev
```

### Build para produção
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## 📝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade da Omnibees. Todos os direitos reservados.

## 🆘 Suporte

Para suporte técnico:
- Email: dev@omnibees.com
- Documentação: [Confluence Omnibees]
- Slack: #beepulse-dev
