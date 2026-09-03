import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('Sentinel', () => {
  it('renders the security analysis workspace', () => {
    render(<App />)
    expect(screen.getByText('SENTINEL')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Run analysis/i })).toBeInTheDocument()
    expect(screen.getByText('Find the signal')).toBeInTheDocument()
  })
})
