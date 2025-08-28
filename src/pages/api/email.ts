import { NextApiRequest, NextApiResponse } from 'next'
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'
import { supabase } from '@/lib/supabase'
import Logger from '@/lib/logger'

interface EmailRequest {
  leadId: number
  nome: string
  email: string
  linkRelatorio: string
  nomeHotel: string
}

class EmailService {
  private static mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY || 'demo-key'
  })

  static async sendReportEmail(data: EmailRequest): Promise<boolean> {
    try {
      // Verificar se o MailerSend está configurado
      if (!process.env.MAILERSEND_API_KEY || process.env.MAILERSEND_API_KEY === 'your_mailersend_api_key') {
        Logger.info('mailersend', 'MailerSend não configurado - simulando envio de email', {
          email: data.email,
          nome: data.nome,
          linkRelatorio: data.linkRelatorio
        })
        return true
      }

      const sentFrom = new Sender('noreply@omnibees.com', 'BeePulse Omnibees')
      const recipients = [new Recipient(data.email, data.nome)]

      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setSubject('Seu Diagnóstico Digital – BeePulse Omnibees')
        .setHtml(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Seu Diagnóstico Digital BeePulse</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .cta-button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
              .logo { max-width: 150px; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🚀 Seu Diagnóstico Digital está pronto!</h1>
                <p>Análise completa do ${data.nomeHotel}</p>
              </div>
              
              <div class="content">
                <h2>Olá, ${data.nome}!</h2>
                
                <p>Aqui está o diagnóstico digital do seu hotel feito pelo <strong>BeePulse</strong>.</p>
                
                <p>Nossa análise identificou oportunidades específicas para melhorar a performance digital do <strong>${data.nomeHotel}</strong> e aumentar suas reservas diretas.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${data.linkRelatorio}" class="cta-button">📊 Acessar Relatório Completo</a>
                </div>
                
                <p><strong>O que você encontrará no relatório:</strong></p>
                <ul>
                  <li>✅ Análise detalhada de performance</li>
                  <li>📱 Avaliação da experiência mobile</li>
                  <li>🔍 Otimizações de SEO recomendadas</li>
                  <li>💳 Análise de métodos de pagamento</li>
                  <li>📈 Comparativo com o mercado</li>
                  <li>🎯 Recomendações personalizadas Omnibees</li>
                </ul>
                
                <p>Tem dúvidas sobre o relatório? Nossa equipe está pronta para ajudar você a implementar as melhorias sugeridas.</p>
                
                <p>Atenciosamente,<br>
                <strong>Equipe BeePulse Omnibees</strong></p>
              </div>
              
              <div class="footer">
                <p>© 2024 Omnibees - Tecnologia Hoteleira</p>
                <p>Este email foi enviado automaticamente pelo BeePulse</p>
              </div>
            </div>
          </body>
          </html>
        `)
        .setText(`
          Olá, ${data.nome}!
          
          Aqui está o diagnóstico digital do seu hotel feito pelo BeePulse.
          
          Nossa análise identificou oportunidades específicas para melhorar a performance digital do ${data.nomeHotel} e aumentar suas reservas diretas.
          
          Acesse seu relatório completo em: ${data.linkRelatorio}
          
          O que você encontrará no relatório:
          - Análise detalhada de performance
          - Avaliação da experiência mobile
          - Otimizações de SEO recomendadas
          - Análise de métodos de pagamento
          - Comparativo com o mercado
          - Recomendações personalizadas Omnibees
          
          Tem dúvidas sobre o relatório? Nossa equipe está pronta para ajudar você a implementar as melhorias sugeridas.
          
          Atenciosamente,
          Equipe BeePulse Omnibees
          
          © 2024 Omnibees - Tecnologia Hoteleira
        `)

      await this.mailerSend.email.send(emailParams)
      Logger.info('mailersend', 'Email enviado com sucesso', {
        email: data.email,
        nome: data.nome,
        nomeHotel: data.nomeHotel
      })
      return true

    } catch (error) {
      Logger.error('mailersend', 'Erro ao enviar email', {
        email: data.email,
        nome: data.nome
      }, error instanceof Error ? error : new Error('Erro desconhecido'))
      return false
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { leadId, nome, email, linkRelatorio, nomeHotel }: EmailRequest = req.body

    // Validar dados obrigatórios
    if (!leadId || !nome || !email || !linkRelatorio || !nomeHotel) {
      return res.status(400).json({ error: 'Dados obrigatórios ausentes' })
    }

    // Enviar email
    const emailSent = await EmailService.sendReportEmail({
      leadId,
      nome,
      email,
      linkRelatorio,
      nomeHotel
    })

    // Atualizar status no Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co') {
      const { error } = await supabase
        .from('leads_beepulse')
        .update({ email_sent: emailSent })
        .eq('id', leadId)

      if (error) {
        Logger.error('supabase', 'Erro ao atualizar status do email no Supabase', { leadId, email }, new Error(error.message))
      } else {
        Logger.info('supabase', 'Status do email atualizado no Supabase', { leadId, email_sent: emailSent })
      }
    } else {
      Logger.info('supabase', 'Status do email atualizado em modo demo', { leadId, email_sent: emailSent })
    }

    return res.status(200).json({ 
      success: true, 
      email_sent: emailSent,
      message: emailSent ? 'Email enviado com sucesso' : 'Falha no envio do email'
    })

  } catch (error) {
    Logger.error('general', 'Erro na API de email', { body: req.body }, error instanceof Error ? error : new Error('Erro desconhecido'))
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    })
  }
}