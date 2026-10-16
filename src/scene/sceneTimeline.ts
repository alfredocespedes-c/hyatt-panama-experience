export interface SceneState {
  city: number
  hotel: number
  ballroom: number
}

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const smooth = (value: number) => {
  const t = clamp(value)
  return t * t * (3 - 2 * t)
}
const between = (value: number, start: number, end: number) => smooth((value - start) / (end - start))

export function sceneStateAt(input: number): SceneState {
  const progress = clamp(input)
  const hotelIn = between(progress, 0.1, 0.28)
  const roomIn = between(progress, 0.72, 0.9)
  return {
    // Remove foreground city blocks before the camera descends. Keeping
    // them visible during the approach lets their back faces fill mobile
    // screens and reads as clipping rather than a deliberate fly-through.
    city: 1 - between(progress, 0.24, 0.44),
    hotel: hotelIn * (1 - roomIn),
    ballroom: roomIn,
  }
}
