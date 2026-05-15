import client from './client'

export async function login(email: string, password: string) {
  const { data } = await client.post('/auth/login', { email, password })
  return data as { token: string; user: unknown }
}

export async function register(email: string, password: string, name: string) {
  const { data } = await client.post('/auth/register', { email, password, name })
  return data as { token: string; user: unknown }
}

export async function getProfile() {
  const { data } = await client.get('/auth/profile')
  return data
}
