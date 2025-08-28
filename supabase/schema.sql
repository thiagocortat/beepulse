-- BeePulse Database Schema for Supabase
-- Execute este script no SQL Editor do Supabase para criar as tabelas necessárias

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela para armazenar leads de potenciais clientes
CREATE TABLE IF NOT EXISTS leads_beepulse (
    id BIGSERIAL PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    nome_hotel VARCHAR(255) NOT NULL,
    site_url TEXT,
    score_basico TEXT,
    relatório_avancado JSONB,
    pdf_url TEXT,
    salesforce_id VARCHAR(100),
    email_sent BOOLEAN DEFAULT FALSE,
    analysis_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para armazenar análises completas (analysisSnapshot)
CREATE TABLE IF NOT EXISTS analises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_url TEXT NOT NULL,
    analysis_snapshot JSONB NOT NULL,
    cached_until TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para otimização de consultas
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads_beepulse(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads_beepulse(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_salesforce_id ON leads_beepulse(salesforce_id);
CREATE INDEX IF NOT EXISTS idx_analises_site_url ON analises(site_url);
CREATE INDEX IF NOT EXISTS idx_analises_cached_until ON analises(cached_until);
CREATE INDEX IF NOT EXISTS idx_analises_created_at ON analises(created_at DESC);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_beepulse_updated_at
    BEFORE UPDATE ON leads_beepulse
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analises_updated_at
    BEFORE UPDATE ON analises
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security) - Opcional, ajuste conforme necessário
ALTER TABLE leads_beepulse ENABLE ROW LEVEL SECURITY;
ALTER TABLE analises ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura e escrita para usuários autenticados
-- Ajuste conforme suas necessidades de segurança
CREATE POLICY "Allow all operations for authenticated users" ON leads_beepulse
    FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON analises
    FOR ALL USING (true);

-- Comentários para documentação
COMMENT ON TABLE leads_beepulse IS 'Tabela para armazenar leads de potenciais clientes do BeePulse';
COMMENT ON TABLE analises IS 'Tabela para armazenar análises completas de sites (analysisSnapshot) com cache';
COMMENT ON COLUMN analises.analysis_snapshot IS 'JSON contendo toda a estrutura AnalysisSnapshot com dados de PSI, CrUX, segurança, domínio, DNS e recomendações';
COMMENT ON COLUMN analises.cached_until IS 'Data/hora até quando esta análise é considerada válida para cache';