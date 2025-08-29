'use client'

import { useEffect } from 'react'

export default function SobreNos() {
  useEffect(() => {
    window.open('https://www.omnibees.com/por-que-omnibees/', '_blank', 'noopener,noreferrer')
    window.history.back()
  }, [])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecionando para informações sobre a Omnibees...</p>
        <p className="text-sm text-gray-500 mt-2">
          Se não foi redirecionado automaticamente,{' '}
          <a 
            href="https://www.omnibees.com/por-que-omnibees/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-yellow-600 hover:text-yellow-700 underline"
          >
            clique aqui
          </a>
        </p>
      </div>
    </div>
  )
}