import client from './client'

export async function runBacktest(params: {
  agentId: string
  symbol: string
  startDate: string
  endDate: string
}) {
  const { data } = await client.post('/backtest', params)
  return data
}
