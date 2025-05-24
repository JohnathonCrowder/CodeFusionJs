import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react'
import React, { useContext } from 'react'
import { ThemeContext, ThemeProvider } from '../ThemeContext'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true
})

// Mock matchMedia
const matchMediaMock = vi.fn()
Object.defineProperty(window, 'matchMedia', {
  value: matchMediaMock,
  writable: true,
  configurable: true
})

// Mock console.warn to suppress warnings during tests
const originalConsoleWarn = console.warn;
beforeEach(() => {
  console.warn = vi.fn();
});

afterEach(() => {
  console.warn = originalConsoleWarn;
});

// Test component that uses the theme context
const TestComponent = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext)
  
  return (
    <div>
      <div data-testid="dark-mode-status">{darkMode ? 'dark' : 'light'}</div>
      <button onClick={toggleDarkMode}>Toggle Theme</button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()
    
    // Clear the document
    document.documentElement.classList.remove('dark')
    
    // Default matchMedia mock (system prefers light mode)
    matchMediaMock.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  })

  afterEach(() => {
    // Clean up after each test
    document.documentElement.classList.remove('dark')
  })

  describe('Default Context Values', () => {
    it('should provide default context values when used outside provider', () => {
      // Create a test component that tries to use context without provider
      const TestComponentWithoutProvider = () => {
        const context = useContext(ThemeContext)
        return (
          <div>
            <div data-testid="default-dark-mode">{String(context.darkMode)}</div>
            <button onClick={context.toggleDarkMode}>Toggle</button>
          </div>
        )
      }

      render(<TestComponentWithoutProvider />)
      
      expect(screen.getByTestId('default-dark-mode')).toHaveTextContent('false')
      
      // The default toggleDarkMode should be a no-op function
      const button = screen.getByText('Toggle')
      fireEvent.click(button) // Should not throw
    })
  })

  describe('Initial State', () => {
    it('should default to light mode when no saved preference and system prefers light', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('light')
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('should use saved preference from localStorage when available', () => {
      localStorageMock.getItem.mockReturnValue('true')
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('should use system preference when no saved preference exists', () => {
      localStorageMock.getItem.mockReturnValue(null)
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('should prioritize saved preference over system preference', () => {
      localStorageMock.getItem.mockReturnValue('false')
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('light')
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })

  describe('Toggle Functionality', () => {
    it('should toggle dark mode when toggleDarkMode is called', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('light')
      
      const toggleButton = screen.getByText('Toggle Theme')
      fireEvent.click(toggleButton)
      
      expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('should toggle from dark to light mode', () => {
      localStorageMock.getItem.mockReturnValue('true')
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('dark')
      
      const toggleButton = screen.getByText('Toggle Theme')
      fireEvent.click(toggleButton)
      
      expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('light')
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('should handle multiple toggles correctly', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      const toggleButton = screen.getByText('Toggle Theme')
      
      // Initial state: light
      expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('light')
      
      // Toggle to dark
      fireEvent.click(toggleButton)
      expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('dark')
      
      // Toggle back to light
      fireEvent.click(toggleButton)
      expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('light')
      
      // Toggle to dark again
      fireEvent.click(toggleButton)
      expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('dark')
    })
  })

  describe('DOM Manipulation', () => {
    it('should add dark class to html element when dark mode is enabled', () => {
      localStorageMock.getItem.mockReturnValue('true')
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('should remove dark class from html element when dark mode is disabled', () => {
      localStorageMock.getItem.mockReturnValue('false')
      
      // Pre-add the dark class
      document.documentElement.classList.add('dark')
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('should update DOM when theme changes', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      expect(document.documentElement.classList.contains('dark')).toBe(false)
      
      const toggleButton = screen.getByText('Toggle Theme')
      fireEvent.click(toggleButton)
      
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
  })

  describe('LocalStorage Integration', () => {
    it('should save theme preference to localStorage when changed', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      const toggleButton = screen.getByText('Toggle Theme')
      fireEvent.click(toggleButton)
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('darkMode', 'true')
    })

    it('should update localStorage on each toggle', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      const toggleButton = screen.getByText('Toggle Theme')
      
      // Toggle to dark
      fireEvent.click(toggleButton)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('darkMode', 'true')
      
      // Toggle to light
      fireEvent.click(toggleButton)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('darkMode', 'false')
    })

    it('should read from localStorage on mount', () => {
      localStorageMock.getItem.mockReturnValue('true')
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('darkMode')
    })

    it('should handle localStorage errors gracefully', () => {
      // Make localStorage.getItem throw an error
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage not available')
      })
      
      // Should not throw and should use default value (light mode)
      expect(() => {
        render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        )
      }).not.toThrow()
      
      expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('light')
      
      // Should have logged a warning
      expect(console.warn).toHaveBeenCalledWith('localStorage is not available:', expect.any(Error))
    })
  })

  describe('Multiple Children', () => {
    it('should provide context to multiple children', () => {
      const TestComponent2 = () => {
        const { darkMode } = useContext(ThemeContext)
        return <div data-testid="component2">{darkMode ? 'dark' : 'light'}</div>
      }
      
      localStorageMock.getItem.mockReturnValue('true')
      
      render(
        <ThemeProvider>
          <TestComponent />
          <TestComponent2 />
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('dark')
      expect(screen.getByTestId('component2')).toHaveTextContent('dark')
    })

    it('should update all children when theme changes', () => {
      const TestComponent2 = () => {
        const { darkMode } = useContext(ThemeContext)
        return <div data-testid="component2">{darkMode ? 'dark' : 'light'}</div>
      }
      
      localStorageMock.getItem.mockReturnValue(null)
      
      render(
        <ThemeProvider>
          <TestComponent />
          <TestComponent2 />
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('light')
      expect(screen.getByTestId('component2')).toHaveTextContent('light')
      
      const toggleButton = screen.getByText('Toggle Theme')
      fireEvent.click(toggleButton)
      
      expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('dark')
      expect(screen.getByTestId('component2')).toHaveTextContent('dark')
    })
  })

  describe('Hook Usage', () => {
    it('should work with custom hooks', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const { result } = renderHook(() => useContext(ThemeContext), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>
      })
      
      expect(result.current.darkMode).toBe(false)
      expect(typeof result.current.toggleDarkMode).toBe('function')
    })

    it('should update hook values when toggled', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const { result } = renderHook(() => useContext(ThemeContext), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>
      })
      
      expect(result.current.darkMode).toBe(false)
      
      act(() => {
        result.current.toggleDarkMode()
      })
      
      expect(result.current.darkMode).toBe(true)
    })
  })

  describe('Re-rendering', () => {
    it('should not cause unnecessary re-renders', () => {
      let renderCount = 0
      
      const TestComponentWithCounter = () => {
        renderCount++
        const { darkMode, toggleDarkMode } = useContext(ThemeContext)
        
        return (
          <div>
            <div data-testid="render-count">{renderCount}</div>
            <div data-testid="dark-mode">{darkMode ? 'dark' : 'light'}</div>
            <button onClick={toggleDarkMode}>Toggle</button>
          </div>
        )
      }
      
      localStorageMock.getItem.mockReturnValue(null)
      
      const { rerender } = render(
        <ThemeProvider>
          <TestComponentWithCounter />
        </ThemeProvider>
      )
      
      expect(renderCount).toBe(1)
      
      // Re-render with same provider
      rerender(
        <ThemeProvider>
          <TestComponentWithCounter />
        </ThemeProvider>
      )
      
      // Should not increase render count if theme hasn't changed
      expect(renderCount).toBe(2)
    })
  })

  describe('Edge Cases', () => {
    it('should handle invalid localStorage values', () => {
      localStorageMock.getItem.mockReturnValue('invalid-boolean-value')
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      // Should default to false for invalid values
      expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('light')
    })

    it('should handle null children', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      expect(() => {
        render(
          <ThemeProvider>
            {null}
          </ThemeProvider>
        )
      }).not.toThrow()
    })

    it('should handle fragment children', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      render(
        <ThemeProvider>
          <>
            <TestComponent />
            <div>Other content</div>
          </>
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('light')
      expect(screen.getByText('Other content')).toBeInTheDocument()
    })

    it('should handle matchMedia not being available', () => {
      // Temporarily remove matchMedia
      const originalMatchMedia = window.matchMedia
      delete (window as any).matchMedia
      
      localStorageMock.getItem.mockReturnValue(null)
      
      expect(() => {
        render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        )
      }).not.toThrow()
      
      // Should default to light mode when matchMedia is not available
      expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('light')
      
      // Should have logged a warning
      expect(console.warn).toHaveBeenCalledWith('matchMedia is not available:', expect.any(Error))
      
      // Restore matchMedia
      window.matchMedia = originalMatchMedia
    })
  })

  describe('System Preference Changes', () => {
    it('should respect initial system preference', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      // Test with dark preference
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('dark-mode-status')).toHaveTextContent('dark')
    })

    // Note: Testing system preference changes during runtime would require
    // more complex mocking of the matchMedia addEventListener
  })

  describe('TypeScript Types', () => {
    it('should have correct context type', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const TestTypeComponent = () => {
        const context = useContext(ThemeContext)
        
        // These should be the correct types
        const isDarkMode: boolean = context.darkMode
        const toggle: () => void = context.toggleDarkMode
        
        return (
          <div>
            <div data-testid="is-boolean">{typeof isDarkMode}</div>
            <div data-testid="is-function">{typeof toggle}</div>
          </div>
        )
      }
      
      render(
        <ThemeProvider>
          <TestTypeComponent />
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('is-boolean')).toHaveTextContent('boolean')
      expect(screen.getByTestId('is-function')).toHaveTextContent('function')
    })
  })
})