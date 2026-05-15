import client from './client'

export async function getMarketData(ticker: string) {
  const { data } = await client.get(`/market/${ticker}`)
  return data
}
