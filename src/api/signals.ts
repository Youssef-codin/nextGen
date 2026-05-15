import client from './client'

export async function getTopSignals() {
  const { data } = await client.get('/signals/top')
  return data
}

export async function getSignalByTicker(ticker: string) {
  const { data } = await client.get(`/signals/${ticker}`)
  return data
}
