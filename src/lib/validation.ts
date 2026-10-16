export type FieldKey = 'generalManager' | 'foodBeverageDirector' | 'hotelName' | 'email'

export type FormData = Record<FieldKey, string>

const requiredMessages: Record<FieldKey, string> = {
  generalManager: 'Enter the name of the General Manager.',
  foodBeverageDirector: 'Enter the name of the Food & Beverage Director.',
  hotelName: 'Enter the hotel name.',
  email: 'Enter your e-mail contact.',
}

export function validateField(field: FieldKey, value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return requiredMessages[field]
  if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(trimmed)) {
    return 'Enter a valid e-mail address.'
  }
  return null
}
