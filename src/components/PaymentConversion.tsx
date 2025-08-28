'use client'

interface PaymentConversionProps {
  siteUrl: string
}

export default function PaymentConversion({ siteUrl }: PaymentConversionProps) {
  // Simular análise de métodos de pagamento (mock)
  const paymentMethods = {
    creditCard: true,
    debitCard: Math.random() > 0.3,
    pix: Math.random() > 0.4,
    paypal: Math.random() > 0.6,
    applePay: Math.random() > 0.8,
    googlePay: Math.random() > 0.8,
    bankTransfer: Math.random() > 0.5
  }

  const availableMethods = Object.entries(paymentMethods).filter(([_, available]) => available)
  const missingMethods = Object.entries(paymentMethods).filter(([_, available]) => !available)
  
  const conversionImpact = {
    pix: !paymentMethods.pix ? 15 : 0,
    paypal: !paymentMethods.paypal ? 8 : 0,
    applePay: !paymentMethods.applePay ? 12 : 0,
    googlePay: !paymentMethods.googlePay ? 10 : 0
  }

  const totalPotentialIncrease = Object.values(conversionImpact).reduce((sum, impact) => sum + impact, 0)

  const getMethodIcon = (method: string) => {
    const icons: { [key: string]: string } = {
      creditCard: '💳',
      debitCard: '💳',
      pix: '📱',
      paypal: '🅿️',
      applePay: '🍎',
      googlePay: '🔍',
      bankTransfer: '🏦'
    }
    return icons[method] || '💰'
  }

  const getMethodName = (method: string) => {
    const names: { [key: string]: string } = {
      creditCard: 'Cartão de Crédito',
      debitCard: 'Cartão de Débito',
      pix: 'PIX',
      paypal: 'PayPal',
      applePay: 'Apple Pay',
      googlePay: 'Google Pay',
      bankTransfer: 'Transferência Bancária'
    }
    return names[method] || method
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pagamentos e Conversão</h2>
        <p className="text-gray-600">Análise dos métodos de pagamento disponíveis</p>
      </div>

      {/* Status Atual */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Métodos Disponíveis */}
        <div>
          <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
            ✅ Métodos Disponíveis ({availableMethods.length})
          </h3>
          <div className="space-y-3">
            {availableMethods.map(([method]) => (
              <div key={method} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <span className="text-2xl">{getMethodIcon(method)}</span>
                <span className="font-medium text-green-800">{getMethodName(method)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Métodos Ausentes */}
        <div>
          <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
            ❌ Métodos Ausentes ({missingMethods.length})
          </h3>
          <div className="space-y-3">
            {missingMethods.map(([method]) => (
              <div key={method} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <span className="text-2xl opacity-50">{getMethodIcon(method)}</span>
                <div className="flex-1">
                  <span className="font-medium text-red-800">{getMethodName(method)}</span>
                  {conversionImpact[method as keyof typeof conversionImpact] > 0 && (
                    <p className="text-sm text-red-600">
                      Potencial aumento: +{conversionImpact[method as keyof typeof conversionImpact]}% conversões
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Impacto na Conversão */}
      {totalPotentialIncrease > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">📈</div>
            <div>
              <h3 className="font-semibold text-yellow-800">
                Potencial de Aumento: +{totalPotentialIncrease}% nas Conversões
              </h3>
              <p className="text-yellow-700 text-sm">
                Implementando os métodos ausentes, você pode aumentar significativamente suas reservas
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recomendação Bee2Pay */}
      <div className="bg-gradient-to-r from-blue-50 to-yellow-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xl">B2P</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              🚀 Solução Recomendada: Bee2Pay
            </h3>
            <p className="text-gray-700 mb-4">
              Gateway de pagamento especializado em hotelaria com todos os métodos essenciais integrados.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">✨ Benefícios:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• PIX instantâneo para reservas</li>
                  <li>• Checkout otimizado para mobile</li>
                  <li>• Taxas competitivas para hotelaria</li>
                  <li>• Integração com sistemas hoteleiros</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">📊 Resultados Esperados:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• +{totalPotentialIncrease}% aumento em conversões</li>
                  <li>• Redução de 40% no abandono de carrinho</li>
                  <li>• Checkout 60% mais rápido</li>
                  <li>• Suporte 24/7 especializado</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Conhecer Bee2Pay
              </button>
              <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors">
                Solicitar Demonstração
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas do Setor */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-4">📊 Dados do Setor Hoteleiro</h4>
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">67%</div>
            <div className="text-sm text-gray-600">dos hóspedes preferem PIX</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">23%</div>
            <div className="text-sm text-gray-600">aumento com checkout otimizado</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">45%</div>
            <div className="text-sm text-gray-600">das reservas são mobile</div>
          </div>
        </div>
      </div>
    </div>
  )
}