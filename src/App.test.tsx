import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('response experience', () => {
  beforeEach(() => localStorage.clear())

  it('opens on tap and skips directly into one-question flow', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Begin the experience' }))
    await user.click(screen.getByRole('button', { name: 'Skip to questions' }))
    expect(screen.getByRole('heading', { name: 'Name of General Manager' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Hotel Name' })).not.toBeInTheDocument()
  })

  it('prevents advancing past an empty answer', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Skip directly to questions' }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText('Enter the name of the General Manager.')).toBeInTheDocument()
  })
})
