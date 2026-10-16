import type { FormData } from './validation'

const DEMO_KEY = 'arrival-demo-submissions'

export interface DataService {
  mode: 'demo' | 'production'
  submit(data: FormData): Promise<void>
}

interface ServiceConfig {
  url?: string
  anonKey?: string
}

export function createDataService(config: ServiceConfig): DataService {
  if (!config.url || !config.anonKey) {
    return {
      mode: 'demo',
      async submit(data) {
        const current = JSON.parse(localStorage.getItem(DEMO_KEY) ?? '[]') as unknown[]
        current.push({ ...data, submittedAt: new Date().toISOString() })
        localStorage.setItem(DEMO_KEY, JSON.stringify(current))
      },
    }
  }

  return {
    mode: 'production',
    async submit(data) {
      const response = await fetch(`${config.url!.replace(/\/$/, '')}/rest/v1/event_responses`, {
        method: 'POST',
        headers: {
          apikey: config.anonKey!,
          Authorization: `Bearer ${config.anonKey!}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          general_manager: data.generalManager.trim(),
          food_beverage_director: data.foodBeverageDirector.trim(),
          hotel_name: data.hotelName.trim(),
          email_contact: data.email.trim(),
          user_agent: navigator.userAgent,
        }),
      })
      if (!response.ok) throw new Error('We could not save your response. Please try again.')
    },
  }
}
