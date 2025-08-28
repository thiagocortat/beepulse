interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error'
  service: 'salesforce' | 'mailersend' | 'supabase' | 'general'
  message: string
  data?: any
  error?: string
}

class Logger {
  private static logs: LogEntry[] = []
  private static maxLogs = 1000

  static log(level: LogEntry['level'], service: LogEntry['service'], message: string, data?: any, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      service,
      message,
      data,
      error: error?.message
    }

    // Adicionar ao array de logs
    this.logs.unshift(entry)
    
    // Manter apenas os últimos logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    // Log no console para desenvolvimento
    const logMessage = `[${entry.timestamp}] ${service.toUpperCase()} - ${message}`
    
    switch (level) {
      case 'error':
        console.error(logMessage, data, error)
        break
      case 'warn':
        console.warn(logMessage, data)
        break
      default:
        console.log(logMessage, data)
    }

    // Em produção, aqui você poderia enviar para um serviço de logging externo
    // como Sentry, LogRocket, etc.
  }

  static info(service: LogEntry['service'], message: string, data?: any) {
    this.log('info', service, message, data)
  }

  static warn(service: LogEntry['service'], message: string, data?: any) {
    this.log('warn', service, message, data)
  }

  static error(service: LogEntry['service'], message: string, data?: any, error?: Error) {
    this.log('error', service, message, data, error)
  }

  static getLogs(service?: LogEntry['service'], level?: LogEntry['level']): LogEntry[] {
    let filteredLogs = this.logs

    if (service) {
      filteredLogs = filteredLogs.filter(log => log.service === service)
    }

    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level)
    }

    return filteredLogs
  }

  static getStats() {
    const total = this.logs.length
    const errors = this.logs.filter(log => log.level === 'error').length
    const warnings = this.logs.filter(log => log.level === 'warn').length
    const info = this.logs.filter(log => log.level === 'info').length

    const byService = {
      salesforce: this.logs.filter(log => log.service === 'salesforce').length,
      mailersend: this.logs.filter(log => log.service === 'mailersend').length,
      supabase: this.logs.filter(log => log.service === 'supabase').length,
      general: this.logs.filter(log => log.service === 'general').length
    }

    return {
      total,
      byLevel: { errors, warnings, info },
      byService
    }
  }

  static clearLogs() {
    this.logs = []
  }
}

export default Logger