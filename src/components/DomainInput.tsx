'use client'

import { useState } from 'react'

interface DomainInputProps {
  onAnalyze: (url: string) => void
  isLoading: boolean
}

export default function DomainInput({ onAnalyze, isLoading }: DomainInputProps) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  const validateUrl = (input: string): boolean => {
    const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
    return urlRegex.test(input)
  }

  const handleChange = (value: string) => {
    setUrl(value)
    try { localStorage.setItem('lastAnalyzedUrl', value) } catch {}
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!url.trim()) {
      setError('Por favor, digite a URL do seu hotel')
      return
    }

    if (!validateUrl(url)) {
      setError('Por favor, digite uma URL válida (ex: https://seuhotel.com.br)')
      return
    }

    onAnalyze(url)
  }

  const scrollToForm = () => {
    const formElement = document.getElementById('lead-form')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="domain-analysis" className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-omnibees-black mb-4">
            Analise seu site gratuitamente
          </h2>
          <p className="text-lg text-omnibees-gray-medium">
            Descubra como está a performance digital do seu hotel em segundos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={url}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Digite o site do seu hotel (ex: https://seuhotel.com.br)"
                className={`w-full px-4 py-3 border-2 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-omnibees-yellow transition-colors ${
                  error ? 'border-red-500' : 'border-gray-300 focus:border-omnibees-yellow'
                }`}
                disabled={isLoading}
              />
              {error && (
                <p className="text-red-500 text-sm mt-2 animate-fade-in">{error}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-omnibees-black border-t-transparent rounded-full animate-spin"></div>
                  Analisando...
                </div>
              ) : (
                'Analisar Agora'
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-omnibees-gray-medium">
            Já tem os dados? {' '}
            <button
              onClick={scrollToForm}
              className="text-omnibees-yellow hover:underline font-medium"
            >
              Solicite o relatório completo
            </button>
          </p>
        </div>
      </div>
    </section>
  )
}