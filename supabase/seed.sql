-- Dados de exemplo para desenvolvimento e testes
-- Execute este script APÓS o schema.sql para popular as tabelas com dados de teste

-- Inserir leads de exemplo
INSERT INTO leads_beepulse (
    nome_completo,
    email,
    telefone,
    nome_hotel,
    site_url,
    score_basico,
    relatório_avancado,
    salesforce_id,
    email_sent,
    created_at
) VALUES 
(
    'João Silva',
    'joao.silva@hotelexemplo.com',
    '(11) 99999-9999',
    'Hotel Exemplo São Paulo',
    'https://hotelexemplo.com',
    '85',
    '{
        "scores": {
            "performance": 82,
            "seo": 88,
            "mobile": 79,
            "overall": 85
        },
        "insights": [
            "Performance mobile precisa de otimização",
            "SEO está bem estruturado",
            "Oportunidades de melhoria no checkout"
        ],
        "recommendations": [
            "BeeDirect para otimizar reservas",
            "Bee2Pay para pagamentos mobile",
            "BeeConnect para visibilidade"
        ],
        "generated_at": "2024-01-15T10:30:00Z"
    }',
    'SF001234',
    true,
    NOW() - INTERVAL '2 days'
),
(
    'Maria Santos',
    'maria@pousadaverde.com.br',
    '(21) 88888-8888',
    'Pousada Verde Rio de Janeiro',
    'https://pousadaverde.com.br',
    '72',
    '{
        "scores": {
            "performance": 68,
            "seo": 75,
            "mobile": 70,
            "overall": 72
        },
        "insights": [
            "Tempo de carregamento pode ser melhorado",
            "Imagens não otimizadas",
            "Falta de cache do navegador"
        ],
        "recommendations": [
            "Implementar CDN",
            "Otimizar imagens",
            "Configurar cache"
        ],
        "generated_at": "2024-01-14T15:45:00Z"
    }',
    'SF001235',
    false,
    NOW() - INTERVAL '1 day'
),
(
    'Carlos Oliveira',
    'carlos@resortparaiso.com',
    '(31) 77777-7777',
    'Resort Paraíso Minas Gerais',
    'https://resortparaiso.com',
    '91',
    '{
        "scores": {
            "performance": 89,
            "seo": 92,
            "mobile": 88,
            "overall": 91
        },
        "insights": [
            "Excelente performance geral",
            "SEO muito bem otimizado",
            "Site mobile-friendly"
        ],
        "recommendations": [
            "Manter as boas práticas",
            "Monitorar performance continuamente",
            "Considerar PWA"
        ],
        "generated_at": "2024-01-13T09:20:00Z"
    }',
    'SF001236',
    true,
    NOW() - INTERVAL '3 hours'
);

-- Inserir análises de exemplo com cache válido
INSERT INTO analises (
    site_url,
    analysis_snapshot,
    cached_until
) VALUES 
(
    'https://hotelexemplo.com',
    '{
        "meta": {
            "siteUrl": "https://hotelexemplo.com",
            "analyzedAtISO": "2024-01-15T10:30:00Z",
            "beePulseScore": 85
        },
        "psi": {
            "performance": 82,
            "seo": 88,
            "accessibility": 79,
            "bestPractices": 85,
            "topOpportunities": [
                {
                    "id": "optimize-images",
                    "title": "Otimizar imagens",
                    "description": "Comprimir e redimensionar imagens",
                    "category": "performance",
                    "impact": "high",
                    "savings": { "ms": 1200 }
                }
            ]
        },
        "crux": {
            "mobile": {
                "lcp": { "p75": 2800, "goodPct": 65 },
                "cls": { "p75": 0.15, "goodPct": 72 },
                "inp": { "p75": 180, "goodPct": 68 },
                "fcp": { "p75": 1800, "goodPct": 70 },
                "ttfb": { "p75": 600, "goodPct": 75 }
            },
            "desktop": {
                "lcp": { "p75": 1200, "goodPct": 85 },
                "cls": { "p75": 0.08, "goodPct": 88 },
                "inp": { "p75": 120, "goodPct": 82 },
                "fcp": { "p75": 900, "goodPct": 90 },
                "ttfb": { "p75": 400, "goodPct": 85 }
            }
        },
        "security": {
            "safeBrowsing": "OK",
            "sslLabsGrade": "A",
            "observatoryGrade": "B",
            "missingHeaders": ["content-security-policy"]
        },
        "domain": {
            "registrar": "GoDaddy",
            "createdAt": "2020-03-15T00:00:00Z",
            "expiresAt": "2025-03-15T00:00:00Z",
            "ageYears": 4
        },
        "dns": {
            "aRecordsCount": 2,
            "hasMX": true,
            "hasNS": true,
            "inferredCDN": "Cloudflare",
            "dohLatencyMs": 45
        },
        "notes": {
            "missingDataFlags": [],
            "sourceErrors": []
        },
        "recommendations": [
            {
                "id": "bee-direct",
                "title": "BeeDirect - Motor de Reservas",
                "description": "Otimize conversões com nosso motor de reservas",
                "category": "conversion",
                "impact": "high",
                "estimatedImprovement": "15-25%"
            }
        ]
    }',
    NOW() + INTERVAL '24 hours'
),
(
    'https://pousadaverde.com.br',
    '{
        "meta": {
            "siteUrl": "https://pousadaverde.com.br",
            "analyzedAtISO": "2024-01-14T15:45:00Z",
            "beePulseScore": 72
        },
        "psi": {
            "performance": 68,
            "seo": 75,
            "accessibility": 70,
            "bestPractices": 72,
            "topOpportunities": [
                {
                    "id": "reduce-server-response-time",
                    "title": "Reduzir tempo de resposta do servidor",
                    "description": "Otimizar backend e banco de dados",
                    "category": "performance",
                    "impact": "high",
                    "savings": { "ms": 800 }
                }
            ]
        },
        "crux": {
            "mobile": {
                "lcp": { "p75": 3200, "goodPct": 45 },
                "cls": { "p75": 0.25, "goodPct": 55 },
                "inp": { "p75": 220, "goodPct": 50 },
                "fcp": { "p75": 2200, "goodPct": 48 },
                "ttfb": { "p75": 800, "goodPct": 52 }
            },
            "desktop": {
                "lcp": { "p75": 1800, "goodPct": 70 },
                "cls": { "p75": 0.12, "goodPct": 75 },
                "inp": { "p75": 150, "goodPct": 72 },
                "fcp": { "p75": 1200, "goodPct": 78 },
                "ttfb": { "p75": 500, "goodPct": 70 }
            }
        },
        "security": {
            "safeBrowsing": "OK",
            "sslLabsGrade": "B",
            "observatoryGrade": "C",
            "missingHeaders": ["content-security-policy", "x-frame-options"]
        },
        "domain": {
            "registrar": "Registro.br",
            "createdAt": "2018-08-20T00:00:00Z",
            "expiresAt": "2024-08-20T00:00:00Z",
            "ageYears": 6
        },
        "dns": {
            "aRecordsCount": 1,
            "hasMX": true,
            "hasNS": true,
            "dohLatencyMs": 65
        },
        "notes": {
            "missingDataFlags": [],
            "sourceErrors": []
        },
        "recommendations": [
            {
                "id": "bee-2-pay",
                "title": "Bee2Pay - Gateway de Pagamento",
                "description": "Melhore conversão com pagamentos otimizados",
                "category": "payment",
                "impact": "medium",
                "estimatedImprovement": "8-15%"
            }
        ]
    }',
    NOW() + INTERVAL '12 hours'
);

-- Verificar dados inseridos
SELECT 
    'leads_beepulse' as tabela,
    COUNT(*) as total_registros
FROM leads_beepulse
UNION ALL
SELECT 
    'analises' as tabela,
    COUNT(*) as total_registros
FROM analises;

-- Mostrar alguns dados de exemplo
SELECT 
    nome_completo,
    nome_hotel,
    score_basico,
    email_sent,
    created_at
FROM leads_beepulse
ORDER BY created_at DESC;