import { describe, expect, it } from 'vitest'
import { sceneStateAt } from './sceneTimeline'

describe('sceneStateAt', () => {
  it('starts above the conceptual Panama city model', () => {
    expect(sceneStateAt(0)).toMatchObject({ city: 1, hotel: 0, ballroom: 0 })
  })

  it('reveals the hotel massing during approach', () => {
    const state = sceneStateAt(0.46)
    expect(state.hotel).toBeGreaterThan(0.5)
    expect(state.ballroom).toBe(0)
  })

  it('finishes inside the ballroom with the city removed', () => {
    expect(sceneStateAt(1)).toMatchObject({ city: 0, hotel: 0, ballroom: 1 })
  })

  it('clamps timeline input', () => {
    expect(sceneStateAt(3)).toEqual(sceneStateAt(1))
    expect(sceneStateAt(-1)).toEqual(sceneStateAt(0))
  })
})
