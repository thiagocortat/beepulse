'use client'

import { AnalysisSnapshot } from '@/types/analysis'

interface CoreWebVitalsProps {
  cruxData: AnalysisSnapshot['crux']
  notes: AnalysisSnapshot['notes']
}

export default function CoreWebVitals({ cruxData, notes }: CoreWebVitalsProps) {
  const hasCrUXData = !notes.missingDataFlags.includes('crux-mobile') && 
                     !notes.missingDataFlags.includes('crux-desktop')

  const getVitalColor = (goodPct: number) => {
    if (goodPct >= 75) return 'text-green-600'
    if (goodPct >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getVitalBg = (goodPct: number) => {
    if (goodPct >= 75) return 'bg-green-100'
    if (goodPct >= 50) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const formatMetric = (metric: string, value: number | undefined | null) => {
    // Validação mais robusta para garantir que value é um número válido
    if (value === undefined || value === null || typeof value !== 'number' || isNaN(value)) {
      return 'N/A'
    }
    
    switch (metric) {
      case 'lcp':
      case 'fcp':
        return `${(value / 1000).toFixed(1)}s`
      case 'cls':
        return value.toFixed(3)
      case 'inp':
        return `${Math.round(value)}ms`
      case 'ttfb':
        return `${Math.round(value)}ms`
      default:
        return value.toString()
    }
  }

  const vitals = [
    { key: 'lcp', name: 'LCP', description: 'Largest Contentful Paint', unit: 's' },
    { key: 'inp', name: 'INP', description: 'Interaction to Next Paint', unit: 'ms' },
    { key: 'cls', name: 'CLS', description: 'Cumulative Layout Shift', unit: '' },
    { key: 'fcp', name: 'FCP', description: 'First Contentful Paint', unit: 's' },
    { key: 'ttfb', name: 'TTFB', description: 'Time to First Byte', unit: 'ms' }
  ]

  if (!hasCrUXData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Core Web Vitals (CrUX)</h2>
          <p className="text-gray-600">Experiência real dos usuários</p>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Sem amostra suficiente</h3>
          <p className="text-yellow-700">
            Este site não possui dados suficientes no Chrome UX Report. 
            Isso é comum em sites com menor volume de tráfego.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Core Web Vitals (CrUX)</h2>
        <p className="text-gray-600">Experiência real dos usuários baseada em dados do Chrome</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mobile */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            📱 Mobile
          </h3>
          
          <div className="space-y-4">
            {vitals.map((vital) => {
              const data = cruxData.mobile[vital.key as keyof typeof cruxData.mobile]
              
              return (
                <div key={`mobile-${vital.key}`} className={`p-4 rounded-lg ${getVitalBg(data.goodPct)}`}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-semibold text-gray-900">{vital.name}</span>
                      <span className="text-sm text-gray-600 ml-2">({vital.description})</span>
                    </div>
                    <span className={`font-bold ${getVitalColor(data.goodPct)}`}>
                      {data.goodPct}% bons
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">P75:</span>
                    <span className="font-mono text-sm">
                      {formatMetric(vital.key, data.p75)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Desktop */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            💻 Desktop
          </h3>
          
          <div className="space-y-4">
            {vitals.map((vital) => {
              const data = cruxData.desktop[vital.key as keyof typeof cruxData.desktop]
              
              return (
                <div key={`desktop-${vital.key}`} className={`p-4 rounded-lg ${getVitalBg(data.goodPct)}`}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-semibold text-gray-900">{vital.name}</span>
                      <span className="text-sm text-gray-600 ml-2">({vital.description})</span>
                    </div>
                    <span className={`font-bold ${getVitalColor(data.goodPct)}`}>
                      {data.goodPct}% bons
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">P75:</span>
                    <span className="font-mono text-sm">
                      {formatMetric(vital.key, data.p75)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}