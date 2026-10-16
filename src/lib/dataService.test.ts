import { afterEach, describe, expect, it, vi } from 'vitest'
import { createDataService } from './dataService'

const response = {
  generalManager: 'Ana Ruiz',
  foodBeverageDirector: 'Luis Vega',
  hotelName: 'Hotel Central',
  email: 'ana@example.com',
}

describe('data service', () => {
  afterEach(() => vi.restoreAllMocks())

  it('stores demo submissions locally without network access', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    await createDataService({}).submit(response)
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(JSON.parse(localStorage.getItem('arrival-demo-submissions') ?? '[]')).toHaveLength(1)
  })

  it('posts a production submission to Supabase REST', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 201 }))
    await createDataService({ url: 'https://project.supabase.co', anonKey: 'public-anon-key' }).submit(response)
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://project.supabase.co/rest/v1/event_responses',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('surfaces a recoverable error when Supabase rejects the request', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('denied', { status: 403 }))
    await expect(createDataService({ url: 'https://project.supabase.co', anonKey: 'public-anon-key' }).submit(response))
      .rejects.toThrow('We could not save your response. Please try again.')
  })
})
