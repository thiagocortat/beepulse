# Configuração do Supabase para BeePulse

Este diretório contém os arquivos necessários para configurar o banco de dados Supabase do projeto BeePulse.

## 📋 Pré-requisitos

1. Conta no [Supabase](https://supabase.com)
2. Projeto criado no Supabase
3. Variáveis de ambiente configuradas no projeto

## 🚀 Setup Inicial

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Crie uma nova organização (se necessário)
4. Clique em "New Project"
5. Preencha:
   - **Name**: `beepulse-production` (ou nome de sua escolha)
   - **Database Password**: Gere uma senha segura
   - **Region**: Escolha a região mais próxima (ex: South America)
6. Clique em "Create new project"

### 2. Configurar Variáveis de Ambiente

Após criar o projeto, copie as credenciais:

1. No dashboard do Supabase, vá em **Settings** → **API**
2. Copie as seguintes informações:
   - **Project URL**
   - **anon public key**

3. No seu projeto BeePulse, crie/atualize o arquivo `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica-anonima

# Outras variáveis necessárias
GOOGLE_API_KEY=sua-chave-google-api
SAFE_BROWSING_API_KEY=sua-chave-safe-browsing
```

### 3. Executar Schema SQL

1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em "New query"
3. Copie todo o conteúdo do arquivo `schema.sql`
4. Cole no editor SQL
5. Clique em "Run" para executar

### 4. Verificar Tabelas Criadas

Após executar o schema, verifique se as tabelas foram criadas:

1. Vá em **Table Editor**
2. Você deve ver as seguintes tabelas:
   - `leads_beepulse` - Para armazenar leads de clientes
   - `analises` - Para armazenar análises completas com cache

## 📊 Estrutura das Tabelas

### Tabela `leads_beepulse`

Armazena informações dos leads gerados pelo formulário:

| Campo | Tipo | Descrição |
|-------|------|----------|
| `id` | BIGSERIAL | ID único do lead |
| `nome_completo` | VARCHAR(255) | Nome completo do cliente |
| `email` | VARCHAR(255) | Email do cliente |
| `telefone` | VARCHAR(20) | Telefone do cliente |
| `nome_hotel` | VARCHAR(255) | Nome do hotel |
| `site_url` | TEXT | URL do site analisado |
| `score_basico` | TEXT | Score básico inicial |
| `relatório_avancado` | JSONB | Dados do relatório avançado |
| `pdf_url` | TEXT | URL do PDF gerado |
| `salesforce_id` | VARCHAR(100) | ID no Salesforce |
| `email_sent` | BOOLEAN | Se o email foi enviado |
| `analysis_id` | VARCHAR(100) | ID da análise relacionada |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Data de atualização |

### Tabela `analises`

Armazena análises completas com sistema de cache:

| Campo | Tipo | Descrição |
|-------|------|----------|
| `id` | UUID | ID único da análise |
| `site_url` | TEXT | URL do site analisado |
| `analysis_snapshot` | JSONB | Dados completos da análise |
| `cached_until` | TIMESTAMP | Validade do cache |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Data de atualização |

## 🔒 Segurança (RLS)

O schema inclui políticas básicas de Row Level Security (RLS):

- **Política atual**: Permite todas as operações para usuários autenticados
- **Recomendação**: Ajustar políticas conforme necessidades específicas de segurança

### Exemplo de Política Mais Restritiva

```sql
-- Remover política atual
DROP POLICY "Allow all operations for authenticated users" ON leads_beepulse;

-- Criar política mais específica
CREATE POLICY "Allow insert and select for authenticated users" ON leads_beepulse
    FOR SELECT USING (true);
    
CREATE POLICY "Allow insert for authenticated users" ON leads_beepulse
    FOR INSERT WITH CHECK (true);
```

## 🔧 Manutenção

### Limpeza de Cache Expirado

Para limpar análises com cache expirado:

```sql
DELETE FROM analises 
WHERE cached_until < NOW();
```

### Backup de Dados

O Supabase faz backups automáticos, mas você pode exportar dados:

1. Vá em **Settings** → **Database**
2. Clique em "Database backups"
3. Faça download do backup quando necessário

## 🚨 Troubleshooting

### Erro de Conexão

- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo
- Verifique se não há caracteres especiais nas credenciais

### Erro de Permissão

- Verifique se as políticas RLS estão configuradas corretamente
- Confirme se a chave `anon` tem as permissões necessárias

### Tabelas Não Encontradas

- Execute novamente o script `schema.sql`
- Verifique se não houve erros durante a execução
- Confirme se está conectado ao projeto correto

## 📞 Suporte

Para problemas específicos do Supabase:
- [Documentação oficial](https://supabase.com/docs)
- [Discord da comunidade](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)