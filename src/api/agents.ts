import client from './client'

export async function getPublishedAgents() {
  const { data } = await client.get('/agents/published')
  return data
}
