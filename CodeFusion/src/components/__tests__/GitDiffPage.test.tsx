import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import GitDiffPage from '../GitDiffPage'

// Mock the GitDiffVisualizer component
vi.mock('../GitDiffVisualizer', () => ({
  default: () => <div data-testid="git-diff-visualizer">Git Diff Visualizer Mock</div>
}))

describe('GitDiffPage Component', () => {
  it('should render without crashing', () => {
    render(<GitDiffPage />)
    expect(screen.getByTestId('git-diff-visualizer')).toBeInTheDocument()
  })

  it('should render GitDiffVisualizer component', () => {
    render(<GitDiffPage />)
    expect(screen.getByText('Git Diff Visualizer Mock')).toBeInTheDocument()
  })
})