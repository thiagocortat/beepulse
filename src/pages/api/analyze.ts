import { NextApiRequest, NextApiResponse } from 'next'
import { analyzeWebsite } from '@/lib/analysis'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { url, hotelName } = req.body

  if (!url || !hotelName) {
    return res.status(400).json({ error: 'URL and hotelName are required' })
  }

  try {
    const analysis = await analyzeWebsite(url, hotelName)
    return res.status(200).json({ success: true, data: analysis })
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    })
  }
}