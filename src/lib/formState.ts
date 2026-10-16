import type { FormData } from './validation'

const DRAFT_KEY = 'arrival-response-draft'

export const emptyDraft: FormData = {
  generalManager: '',
  foodBeverageDirector: '',
  hotelName: '',
  email: '',
}

export function loadDraft(): FormData {
  try {
    const value = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? '') as Partial<FormData>
    return {
      generalManager: typeof value.generalManager === 'string' ? value.generalManager : '',
      foodBeverageDirector: typeof value.foodBeverageDirector === 'string' ? value.foodBeverageDirector : '',
      hotelName: typeof value.hotelName === 'string' ? value.hotelName : '',
      email: typeof value.email === 'string' ? value.email : '',
    }
  } catch {
    return { ...emptyDraft }
  }
}

export function saveDraft(data: FormData): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(data))
}

export function clearDraft(): void {
  localStorage.removeItem(DRAFT_KEY)
}
