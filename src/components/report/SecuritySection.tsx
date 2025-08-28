'use client'

import { AnalysisSnapshot } from '@/types/analysis'

interface SecuritySectionProps {
  securityData: AnalysisSnapshot['security']
  notes: AnalysisSnapshot['notes']
}

export default function SecuritySection({ securityData, notes }: SecuritySectionProps) {
  const isObservatoryUnavailable = notes.sourceErrors.includes('observatory')
  const getSSLColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100'
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100'
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getObservatoryColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100'
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100'
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Segurança</h2>
        <p className="text-gray-600">Análise de segurança e proteção do site</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Safe Browsing */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">
              {securityData.safeBrowsing === 'OK' ? '🛡️' : '⚠️'}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Google Safe Browsing</h3>
          </div>
          
          {securityData.safeBrowsing === 'OK' ? (
            <div className="bg-green-100 border border-green-200 rounded-lg p-4 text-center">
              <span className="text-green-800 font-semibold">✅ Seguro</span>
              <p className="text-green-700 text-sm mt-1">
                Nenhuma ameaça detectada
              </p>
            </div>
          ) : (
            <div className="bg-red-100 border border-red-200 rounded-lg p-4 text-center">
              <span className="text-red-800 font-semibold">🚨 ALERTA</span>
              <p className="text-red-700 text-sm mt-1">
                Possível ameaça detectada
              </p>
            </div>
          )}
        </div>

        {/* SSL Labs */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🔒</div>
            <h3 className="font-semibold text-gray-900 mb-2">SSL/TLS (Qualys)</h3>
          </div>
          
          <div className="text-center">
            <div className={`inline-block px-4 py-2 rounded-lg font-bold text-2xl ${getSSLColor(securityData.sslLabsGrade)}`}>
              {securityData.sslLabsGrade || 'N/A'}
            </div>
            <p className="text-gray-600 text-sm mt-2">
              Certificado e configuração TLS
            </p>
          </div>
        </div>

        {/* Mozilla Observatory */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🔍</div>
            <h3 className="font-semibold text-gray-900 mb-2">HTTP Observatory</h3>
          </div>
          
          {isObservatoryUnavailable ? (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-center">
              <div className="text-gray-500 mb-2">⏳</div>
              <span className="text-gray-700 font-semibold">Indisponível</span>
              <p className="text-gray-600 text-sm mt-1">
                Observatory indisponível no momento; usando dados mais recentes em cache (se houver)
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className={`inline-block px-4 py-2 rounded-lg font-bold text-2xl ${getObservatoryColor(securityData.observatoryGrade)}`}>
                {securityData.observatoryGrade || 'N/A'}
              </div>
              <p className="text-gray-600 text-sm mt-2">
                Headers de segurança
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Missing Headers */}
      {securityData.missingHeaders.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Headers de Segurança Ausentes</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {securityData.missingHeaders.map((header, index) => (
                <div key={index} className="flex items-center text-yellow-800">
                  <span className="text-yellow-500 mr-2">⚠️</span>
                  <code className="text-sm bg-yellow-100 px-2 py-1 rounded">{header}</code>
                </div>
              ))}
            </div>
            <p className="text-yellow-700 text-sm mt-3">
              Implementar estes headers pode melhorar significativamente a segurança do site.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}