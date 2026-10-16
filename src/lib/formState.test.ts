import { beforeEach, describe, expect, it } from 'vitest'
import { clearDraft, loadDraft, saveDraft } from './formState'

const draft = {
  generalManager: 'Ana Ruiz',
  foodBeverageDirector: 'Luis Vega',
  hotelName: 'Hotel Central',
  email: 'ana@example.com',
}

describe('form draft persistence', () => {
  beforeEach(() => localStorage.clear())

  it('round-trips an in-progress response', () => {
    saveDraft(draft)
    expect(loadDraft()).toEqual(draft)
  })

  it('returns a safe empty draft when stored data is invalid', () => {
    localStorage.setItem('arrival-response-draft', '{bad json')
    expect(loadDraft()).toEqual({ generalManager: '', foodBeverageDirector: '', hotelName: '', email: '' })
  })

  it('clears a saved response', () => {
    saveDraft(draft)
    clearDraft()
    expect(loadDraft()).toEqual({ generalManager: '', foodBeverageDirector: '', hotelName: '', email: '' })
  })
})
