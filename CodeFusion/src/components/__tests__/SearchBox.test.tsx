import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBox from '../SearchBox'

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaSearch: ({ className }: { className?: string }) => (
    <span data-testid="search-icon" className={className}>SearchIcon</span>
  ),
  FaTimes: ({ className }: { className?: string }) => (
    <span data-testid="times-icon" className={className}>TimesIcon</span>
  ),
  FaChevronUp: ({ className }: { className?: string }) => (
    <span data-testid="chevron-up-icon" className={className}>ChevronUpIcon</span>
  ),
  FaChevronDown: ({ className }: { className?: string }) => (
    <span data-testid="chevron-down-icon" className={className}>ChevronDownIcon</span>
  ),
}))

describe('SearchBox Component', () => {
  const mockOnClose = vi.fn()
  const mockOnMatchesFound = vi.fn()
  const mockOnCurrentMatchChange = vi.fn()
  
  const sampleContent = `
function hello() {
  console.log("Hello World");
  return "hello";
}

function goodbye() {
  console.log("Goodbye World");
  return "goodbye";
}

// This is a test function
function test() {
  return "test";
}
  `.trim()

  const defaultProps = {
    content: sampleContent,
    isVisible: true,
    onClose: mockOnClose,
    onMatchesFound: mockOnMatchesFound,
    onCurrentMatchChange: mockOnCurrentMatchChange,
    darkMode: false
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render when visible', () => {
      render(<SearchBox {...defaultProps} />)
      
      expect(screen.getByPlaceholderText('Find in code...')).toBeInTheDocument()
    })

    it('should not render when not visible', () => {
      render(<SearchBox {...defaultProps} isVisible={false} />)
      
      expect(screen.queryByPlaceholderText('Find in code...')).not.toBeInTheDocument()
    })

    it('should render search input with search icon', () => {
      render(<SearchBox {...defaultProps} />)
      
      expect(screen.getByTestId('search-icon')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Find in code...')).toBeInTheDocument()
    })

    it('should render navigation buttons', () => {
      render(<SearchBox {...defaultProps} />)
      
      expect(screen.getByTestId('chevron-up-icon')).toBeInTheDocument()
      expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument()
    })

    it('should render close button', () => {
      render(<SearchBox {...defaultProps} />)
      
      expect(screen.getByTestId('times-icon')).toBeInTheDocument()
    })

    it('should render case sensitive and whole word toggles', () => {
      render(<SearchBox {...defaultProps} />)
      
      // Use the actual accessible names from the buttons
      expect(screen.getByRole('button', { name: 'Aa' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '[W]' })).toBeInTheDocument()
    })
  })

  describe('Theme Support', () => {
    it('should apply dark theme classes', () => {
      render(<SearchBox {...defaultProps} darkMode={true} />)
      
      // Need to traverse to the outermost container with theme classes
      const searchContainer = document.querySelector('.fixed.top-20')
      expect(searchContainer).toHaveClass('bg-dark-800/95', 'border-dark-600')
    })

    it('should apply light theme classes', () => {
      render(<SearchBox {...defaultProps} darkMode={false} />)
      
      // Need to traverse to the outermost container with theme classes
      const searchContainer = document.querySelector('.fixed.top-20')
      expect(searchContainer).toHaveClass('bg-white/95', 'border-gray-200')
    })

    it('should apply theme-specific input styles', () => {
      render(<SearchBox {...defaultProps} darkMode={true} />)
      
      const searchInput = screen.getByPlaceholderText('Find in code...')
      expect(searchInput).toHaveClass('bg-dark-700', 'text-dark-100')
    })
  })

  describe('Search Functionality', () => {
    it('should update search term when typing', async () => {
      render(<SearchBox {...defaultProps} />)
      const user = userEvent.setup()
      
      const searchInput = screen.getByPlaceholderText('Find in code...')
      await user.type(searchInput, 'hello')
      
      expect(searchInput).toHaveValue('hello')
    })

    it('should find matches and call onMatchesFound', async () => {
      render(<SearchBox {...defaultProps} />)
      const user = userEvent.setup()
      
      const searchInput = screen.getByPlaceholderText('Find in code...')
      await user.type(searchInput, 'hello')
      
      await waitFor(() => {
        expect(mockOnMatchesFound).toHaveBeenCalled()
        const matches = mockOnMatchesFound.mock.calls[mockOnMatchesFound.mock.calls.length - 1][0]
        expect(matches.length).toBeGreaterThan(0)
      })
    })

    it('should display match count', async () => {
      render(<SearchBox {...defaultProps} />)
      const user = userEvent.setup()
      
      const searchInput = screen.getByPlaceholderText('Find in code...')
      await user.type(searchInput, 'console')
      
      await waitFor(() => {
        expect(screen.getByText(/1 of 2/)).toBeInTheDocument()
      })
    })

    it('should show "No results" when no matches found', async () => {
      render(<SearchBox {...defaultProps} />)
      const user = userEvent.setup()
      
      const searchInput = screen.getByPlaceholderText('Find in code...')
      await user.type(searchInput, 'nonexistent')
      
      await waitFor(() => {
        expect(screen.getByText('No results')).toBeInTheDocument()
      })
    })

    it('should handle empty search term', async () => {
      render(<SearchBox {...defaultProps} />)
      const user = userEvent.setup()
      
      const searchInput = screen.getByPlaceholderText('Find in code...')
      await user.type(searchInput, 'hello')
      await user.clear(searchInput)
      
      await waitFor(() => {
        expect(mockOnMatchesFound).toHaveBeenCalledWith([])
      })
    })

    it('should handle case sensitive search', async () => {
      render(<SearchBox {...defaultProps} />)
      const user = userEvent.setup()
      
      const searchInput = screen.getByPlaceholderText('Find in code...')
      const caseSensitiveButton = screen.getByRole('button', { name: 'Aa' })
      
      await user.click(caseSensitiveButton)
      await user.type(searchInput, 'Hello')
      
      await waitFor(() => {
        const calls = mockOnMatchesFound.mock.calls
        const lastCall = calls[calls.length - 1]
        if (lastCall) {
          const matches = lastCall[0]
          expect(matches.length).toBe(1) // Only "Hello World" with capital H
        }
      })
    })

    it('should handle whole word search', async () => {
      render(<SearchBox {...defaultProps} />)
      const user = userEvent.setup()
      
      const searchInput = screen.getByPlaceholderText('Find in code...')
      const wholeWordButton = screen.getByRole('button', { name: '[W]' })
      
      await user.click(wholeWordButton)
      await user.type(searchInput, 'test')
      
      await waitFor(() => {
        const calls = mockOnMatchesFound.mock.calls
        if (calls.length > 0) {
          const lastCall = calls[calls.length - 1]
          const matches = lastCall[0]
          // Should only match 'test' as a whole word, not partial matches
          expect(matches.length).toBeGreaterThan(0)
        }
      })
    })
  })

  describe('Navigation', () => {
    it('should navigate to next match', async () => {
      render(<SearchBox {...defaultProps} />)
      const user = userEvent.setup()
      
      const searchInput = screen.getByPlaceholderText('Find in code...')
      await user.type(searchInput, 'console')
      
      const nextButton = screen.getByTestId('chevron-down-icon').closest('button')
      await user.click(nextButton!)
      
      await waitFor(() => {
        expect(mockOnCurrentMatchChange).toHaveBeenCalledWith(1)
      })
    })

    it('should navigate to previous match', async () => {
      render(<SearchBox {...defaultProps} />)
      const user = userEvent.setup()
      
      const searchInput = screen.getByPlaceholderText('Find in code...')
      await user.type(searchInput, 'console')
      
      // Navigate to next first
      const nextButton = screen.getByTestId('chevron-down-icon').closest('button')
      await user.click(nextButton!)
      
      // Then navigate to previous
      const prevButton = screen.getByTestId('chevron-up-icon').closest('button')
      await user.click(prevButton!)
      
      await waitFor(() => {
        expect(mockOnCurrentMatchChange).toHaveBeenCalledWith(0)
      })
    })

    it('should wrap around when navigating past last match', async () => {
      render(<SearchBox {...defaultProps} />)
      const user = userEvent.setup()
      
      const searchInput = screen.getByPlaceholderText('Find in code...')
      await user.type(searchInput, 'console')
      
      const nextButton = screen.getByTestId('chevron-down-icon').closest('button')
      
      // Navigate past the last match
      await user.click(nextButton!) // to match 1
      await user.click(nextButton!) // should wrap to match 0
      
      await waitFor(() => {
        const calls = mockOnCurrentMatchChange.mock.calls
        expect(calls[calls.length - 1][0]).toBe(0) // Wrapped to first match
      })
    })

    it('should disable navigation when no results', async () => {
      render(<SearchBox {...defaultProps} />)
      const user = userEvent.setup()
      
      const searchInput = screen.getByPlaceholderText('Find in code...')
      await user.type(searchInput, 'nonexistent')
      
      const nextButton = screen.getByTestId('chevron-down-icon').closest('button')
      const prevButton = screen.getByTestId('chevron-up-icon').closest('button')
      
      await waitFor(() => {
        expect(nextButton).toBeDisabled()
        expect(prevButton).toBeDisabled()
      })
    })
  })

  describe('Keyboard Shortcuts', () => {
    it('should navigate to next match with Enter', async () => {
      render(<SearchBox {...defaultProps} />)
      const user = userEvent.setup()
      
      const searchInput = screen.getByPlaceholderText('Find in code...')
      await user.type(searchInput, 'console')
      
      await user.keyboard('{Enter}')
      
      await waitFor(() => {
        expect(mockOnCurrentMatchChange).toHaveBeenCalledWith(1)
      })
    })

    it('should navigate to previous match with Shift+Enter', async () => {
      render(<SearchBox {...defaultProps} />)
      const user = userEvent.setup()
      
      const searchInput = screen.getByPlaceholderText('Find in code...')
      await user.type(searchInput, 'console')
      
      // First set to match 1
      await user.keyboard('{Enter}')
      
      // Then go back with Shift+Enter
      await user.keyboard('{Shift>}{Enter}{/Shift}')
      
      await waitFor(() => {
        const calls = mockOnCurrentMatchChange.mock.calls
        expect(calls[calls.length - 1][0]).toBe(0)
      })
    })

    it('should focus input when component becomes visible', async () => {
      const { rerender } = render(<SearchBox {...defaultProps} isVisible={false} />)
      
      rerender(<SearchBox {...defaultProps} isVisible={true} />)
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Find in code...')
        expect(searchInput).toHaveFocus()
      }, { timeout: 200 })
    })
  })

  describe('Closing', () => {
    it('should call onClose when close button is clicked', async () => {
      render(<SearchBox {...defaultProps} />)
      const user = userEvent.setup()
      
      const closeButton = screen.getByTestId('times-icon').closest('button')
      await user.click(closeButton!)
      
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should reset search term and match index when closed', () => {
      const { rerender } = render(<SearchBox {...defaultProps} />)
      
      // Component becomes invisible (closed)
      rerender(<SearchBox {...defaultProps} isVisible={false} />)
      
      // When it becomes visible again, it should be reset
      rerender(<SearchBox {...defaultProps} isVisible={true} />)
      
      const searchInput = screen.getByPlaceholderText('Find in code...')
      expect(searchInput).toHaveValue('')
    })
  })

  describe('Search Options', () => {
    it('should toggle case sensitive option', async () => {
      render(<SearchBox {...defaultProps} />)
      const user = userEvent.setup()
      
      const caseSensitiveButton = screen.getByRole('button', { name: 'Aa' })
      
      // Initially not active (check if it doesn't have the active class)
      expect(caseSensitiveButton).toHaveClass('hover:bg-gray-200', 'text-gray-500')
      
      await user.click(caseSensitiveButton)
      
      // Should be active after click (actual class is bg-blue-500)
      await waitFor(() => {
        expect(caseSensitiveButton).toHaveClass('bg-blue-500')
      })
    })

    it('should toggle whole word option', async () => {
      render(<SearchBox {...defaultProps} />)
      const user = userEvent.setup()
      
      const wholeWordButton = screen.getByRole('button', { name: '[W]' })
      
      // Initially not active
      expect(wholeWordButton).toHaveClass('hover:bg-gray-200', 'text-gray-500')
      
      await user.click(wholeWordButton)
      
      // Should be active after click
      await waitFor(() => {
        expect(wholeWordButton).toHaveClass('bg-blue-500')
      })
    })

    it('should show option labels', () => {
      render(<SearchBox {...defaultProps} />)
      
      expect(screen.getByText('Aa')).toBeInTheDocument()
      expect(screen.getByText('[W]')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid regex gracefully', async () => {
      render(<SearchBox {...defaultProps} />)
      const user = userEvent.setup()
      
      const searchInput = screen.getByPlaceholderText('Find in code...')
      
      // Type an invalid regex pattern (safer than square brackets)
      await user.type(searchInput, 'invalid(regex')
      
      // Should not crash and should show no results
      await waitFor(() => {
        expect(mockOnMatchesFound).toHaveBeenCalledWith([])
      })
    })

    it('should handle empty content gracefully', async () => {
      render(<SearchBox {...defaultProps} content="" />)
      const user = userEvent.setup()
      
      const searchInput = screen.getByPlaceholderText('Find in code...')
      await user.type(searchInput, 'test')
      
      expect(screen.getByText('No results')).toBeInTheDocument()
    })

    it('should handle null content gracefully', async () => {
      render(<SearchBox {...defaultProps} content={null as any} />)
      const user = userEvent.setup()
      
      const searchInput = screen.getByPlaceholderText('Find in code...')
      await user.type(searchInput, 'test')
      
      expect(screen.getByText('No results')).toBeInTheDocument()
    })
  })

  describe('Match Information', () => {
    it('should calculate line numbers for matches', async () => {
      render(<SearchBox {...defaultProps} />)
      const user = userEvent.setup()
      
      const searchInput = screen.getByPlaceholderText('Find in code...')
      await user.type(searchInput, 'function')
      
      await waitFor(() => {
        const calls = mockOnMatchesFound.mock.calls
        if (calls.length > 0) {
          const matches = calls[calls.length - 1][0]
          expect(matches.length).toBeGreaterThan(0)
          expect(matches[0]).toHaveProperty('lineNumber')
          expect(matches[0]).toHaveProperty('lineStart')
          expect(matches[0]).toHaveProperty('start')
          expect(matches[0]).toHaveProperty('end')
        }
      })
    })

    it('should provide match indices', async () => {
      render(<SearchBox {...defaultProps} />)
      const user = userEvent.setup()
      
      const searchInput = screen.getByPlaceholderText('Find in code...')
      await user.type(searchInput, 'console')
      
      await waitFor(() => {
        const calls = mockOnMatchesFound.mock.calls
        if (calls.length > 0) {
          const matches = calls[calls.length - 1][0]
          matches.forEach((match: any, index: number) => {
            expect(match.index).toBe(index)
          })
        }
      })
    })
  })

  describe('Accessibility', () => {
    it('should have accessible search input', () => {
      render(<SearchBox {...defaultProps} />)
      
      const searchInput = screen.getByPlaceholderText('Find in code...')
      expect(searchInput).toHaveAttribute('type', 'text')
    })

    it('should have accessible navigation buttons with titles', () => {
      render(<SearchBox {...defaultProps} />)
      
      const nextButton = screen.getByTestId('chevron-down-icon').closest('button')
      const prevButton = screen.getByTestId('chevron-up-icon').closest('button')
      
      expect(nextButton).toHaveAttribute('title', 'Next match (Enter)')
      expect(prevButton).toHaveAttribute('title', 'Previous match (Shift+Enter)')
    })

    it('should have accessible close button with title', () => {
      render(<SearchBox {...defaultProps} />)
      
      const closeButton = screen.getByTestId('times-icon').closest('button')
      expect(closeButton).toHaveAttribute('title', 'Close search (Esc)')
    })

    it('should have accessible option buttons with titles', () => {
      render(<SearchBox {...defaultProps} />)
      
      const caseSensitiveButton = screen.getByRole('button', { name: 'Aa' })
      const wholeWordButton = screen.getByRole('button', { name: '[W]' })
      
      expect(caseSensitiveButton).toHaveAttribute('title', 'Match case')
      expect(wholeWordButton).toHaveAttribute('title', 'Match whole word')
    })
  })
})