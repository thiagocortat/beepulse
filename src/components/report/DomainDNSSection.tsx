'use client'

import { AnalysisSnapshot } from '@/types/analysis'

interface DomainDNSSectionProps {
  domainData: AnalysisSnapshot['domain']
  dnsData: AnalysisSnapshot['dns']
  notes: AnalysisSnapshot['notes']
}

export default function DomainDNSSection({ domainData, dnsData, notes }: DomainDNSSectionProps) {
  const isRDAPUnavailable = notes.missingDataFlags.includes('rdap_unavailable_for_tld') || notes.sourceErrors.includes('rdap')
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getDaysUntilExpiry = (expiresAt?: string) => {
    if (!expiresAt) return null
    const expiry = new Date(expiresAt)
    const now = new Date()
    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getExpiryColor = (days: number | null) => {
    if (!days) return 'text-gray-600'
    if (days < 30) return 'text-red-600'
    if (days < 90) return 'text-yellow-600'
    return 'text-green-600'
  }

  const daysUntilExpiry = getDaysUntilExpiry(domainData.expiresAt)

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Domínio & DNS</h2>
        <p className="text-gray-600">Informações de registro e infraestrutura</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informações do Domínio */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            🌐 Informações do Domínio
          </h3>
          
          {isRDAPUnavailable ? (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 text-center">
              <div className="text-gray-500 mb-3 text-2xl">🌐</div>
              <span className="text-gray-700 font-semibold block mb-2">RDAP Indisponível</span>
              <p className="text-gray-600 text-sm">
                RDAP indisponível para este TLD ou serviço sem resposta
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Idade do domínio:</span>
                  <span className="font-semibold">
                    {domainData.ageYears ? `${domainData.ageYears} anos` : 'N/A'}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Registrar:</span>
                  <span className="font-semibold">
                    {domainData.registrar || 'N/A'}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Criado em:</span>
                  <span className="font-semibold">
                    {formatDate(domainData.createdAt)}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Expira em:</span>
                  <div className="text-right">
                    <span className="font-semibold block">
                       {formatDate(domainData.expiresAt)}
                     </span>
                     {daysUntilExpiry && (
                       <span className={`text-sm ${getExpiryColor(daysUntilExpiry)}`}>
                         {daysUntilExpiry > 0 ? `${daysUntilExpiry} dias restantes` : 'Expirado!'}
                       </span>
                     )}
                   </div>
                 </div>
               </div>
             </div>
           )}
         </div>

        {/* Informações DNS */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            🔧 Configuração DNS
          </h3>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Registros A/AAAA:</span>
                <span className="font-semibold">
                  {dnsData.aRecordsCount} registros
                </span>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Email (MX):</span>
                <span className={`font-semibold ${dnsData.hasMX ? 'text-green-600' : 'text-red-600'}`}>
                  {dnsData.hasMX ? '✅ Configurado' : '❌ Não configurado'}
                </span>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Name Servers (NS):</span>
                <span className={`font-semibold ${dnsData.hasNS ? 'text-green-600' : 'text-red-600'}`}>
                  {dnsData.hasNS ? '✅ Configurado' : '❌ Não configurado'}
                </span>
              </div>
            </div>
            
            {dnsData.inferredCDN && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-700">CDN Detectada:</span>
                  <span className="font-semibold text-blue-800">
                    {dnsData.inferredCDN}
                  </span>
                </div>
              </div>
            )}
            
            {dnsData.dohLatencyMs && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Latência DNS:</span>
                  <span className="font-semibold">
                    {dnsData.dohLatencyMs}ms
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}