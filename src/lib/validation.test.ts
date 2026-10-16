import { describe, expect, it } from 'vitest'
import { validateField } from './validation'

describe('validateField', () => {
  it('requires every response', () => {
    expect(validateField('generalManager', '  ')).toBe('Enter the name of the General Manager.')
  })

  it('rejects malformed email addresses', () => {
    expect(validateField('email', 'director@hotel')).toBe('Enter a valid e-mail address.')
  })

  it('accepts a trimmed, valid email address', () => {
    expect(validateField('email', '  director@hotel.com  ')).toBeNull()
  })
})
