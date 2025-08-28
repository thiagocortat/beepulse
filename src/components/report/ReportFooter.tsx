'use client'

import { AnalysisSnapshot } from '@/types/analysis'

interface ReportFooterProps {
  notes: AnalysisSnapshot['notes']
}

export default function ReportFooter({ notes }: ReportFooterProps) {
  const hasLimitations = notes.missingDataFlags.length > 0 || notes.sourceErrors.length > 0

  return (
    <div className="bg-gray-50 rounded-xl p-8 mt-8">
      <div className="max-w-4xl mx-auto">
        {hasLimitations && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              ⚠️ Limitações e Observações
            </h3>
            
            {notes.missingDataFlags.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">Dados não disponíveis:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {notes.missingDataFlags.map((flag, index) => (
                    <li key={index} className="text-sm">{flag}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {notes.sourceErrors.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">Erros de fonte:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {notes.sourceErrors.map((error, index) => (
                    <li key={index} className="text-sm">{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Sobre os dados CrUX</h4>
              <p className="leading-relaxed">
                Os dados do Chrome UX Report (CrUX) representam a experiência real dos usuários 
                nos últimos 28 dias. Sites com baixo tráfego podem não ter dados suficientes.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Cache e atualizações</h4>
              <p className="leading-relaxed">
                Os dados são atualizados periodicamente. Performance: 12h, Segurança: 24h, 
                DNS/Domínio: 24h. Mudanças recentes podem não estar refletidas.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Indisponibilidades</h4>
              <p className="leading-relaxed">
                Algumas APIs externas podem estar temporariamente indisponíveis. 
                O BeePulse Score é ajustado automaticamente quando isso ocorre.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Metodologia</h4>
              <p className="leading-relaxed">
                O BeePulse Score combina dados do Lighthouse (60%), experiência real CrUX (25%) 
                e segurança (15%) para uma avaliação abrangente.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Fontes de dados</h4>
              <p className="leading-relaxed">
                Observatory: Mozilla HTTP Observatory API v2 • 
                RDAP: IANA Bootstrap → Registry/rdap.org/rdap.net/Verisign/Registro.br
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6 mt-6 text-center">
          <div className="flex items-center justify-center space-x-4 text-gray-500">
            <span className="text-2xl">🐝</span>
            <div>
              <p className="font-semibold">BeePulse by Omnibees</p>
              <p className="text-xs">Análise automatizada com dados reais</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}