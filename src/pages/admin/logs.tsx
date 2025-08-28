import { useState, useEffect, useCallback } from 'react'
import Logger from '@/lib/logger'
import Head from 'next/head'
import Link from 'next/link'

interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error'
  service: 'salesforce' | 'mailersend' | 'supabase' | 'general'
  message: string
  data?: Record<string, unknown>
  error?: string
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [serviceFilter, setServiceFilter] = useState<string>('all')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [stats, setStats] = useState<Record<string, unknown>>({})

  useEffect(() => {
    loadLogs()
    const interval = setInterval(loadLogs, 5000) // Atualizar a cada 5 segundos
    return () => clearInterval(interval)
  }, [])

  const loadLogs = () => {
    const allLogs = Logger.getLogs()
    const logStats = Logger.getStats()
    setLogs(allLogs)
    setStats(logStats)
  }

  const applyFilters = useCallback(() => {
    let filtered = logs

    if (serviceFilter !== 'all') {
      filtered = filtered.filter(log => log.service === serviceFilter)
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter)
    }

    setFilteredLogs(filtered)
  }, [logs, serviceFilter, levelFilter])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const getLevelBadge = (level: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-semibold'
    
    switch (level) {
      case 'error':
        return `${baseClasses} bg-red-100 text-red-800`
      case 'warn':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case 'info':
        return `${baseClasses} bg-blue-100 text-blue-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const getServiceBadge = (service: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-semibold'
    
    switch (service) {
      case 'salesforce':
        return `${baseClasses} bg-purple-100 text-purple-800`
      case 'mailersend':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'supabase':
        return `${baseClasses} bg-indigo-100 text-indigo-800`
      case 'general':
        return `${baseClasses} bg-gray-100 text-gray-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR')
  }

  const clearLogs = () => {
    Logger.clearLogs()
    loadLogs()
  }

  return (
    <>
      <Head>
        <title>Admin - Logs BeePulse</title>
        <meta name="description" content="Logs das integrações BeePulse" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Logs do Sistema</h1>
                  <p className="mt-2 text-gray-600">Monitoramento das integrações em tempo real</p>
                </div>
                <div className="flex space-x-4">
                  <Link href="/admin/leads" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Ver Leads
                  </Link>
                  <button
                    onClick={clearLogs}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Limpar Logs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total de Logs</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.total || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Erros</h3>
              <p className="text-3xl font-bold text-red-600">{stats.byLevel?.errors || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Avisos</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.byLevel?.warnings || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Informações</h3>
              <p className="text-3xl font-bold text-green-600">{stats.byLevel?.info || 0}</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Serviço</label>
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos os serviços</option>
                  <option value="salesforce">Salesforce</option>
                  <option value="mailersend">MailerSend</option>
                  <option value="supabase">Supabase</option>
                  <option value="general">Geral</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nível</label>
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos os níveis</option>
                  <option value="error">Erros</option>
                  <option value="warn">Avisos</option>
                  <option value="info">Informações</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de Logs */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Logs Recentes</h3>
              <p className="text-sm text-gray-600">Mostrando {filteredLogs.length} de {logs.length} logs</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serviço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nível
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mensagem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dados
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map((log, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getServiceBadge(log.service)}>
                          {log.service.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getLevelBadge(log.level)}>
                          {log.level.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{log.message}</div>
                        {log.error && (
                          <div className="text-sm text-red-600 mt-1">Erro: {log.error}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {log.data && (
                          <details className="text-sm">
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                              Ver dados
                            </summary>
                            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                              {JSON.stringify(log.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhum log encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}