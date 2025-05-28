import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeContext } from '../../context/ThemeContext'
import SmartCodeAnalyzer from '../SmartCodeAnalyzer'

// Mock the necessary dependencies
vi.mock('react-icons/fa', () => ({
  FaBrain: () => <span data-testid="brain-icon">BrainIcon</span>,
  FaSpinner: () => <span data-testid="spinner-icon">SpinnerIcon</span>,
  // Add other icon mocks as needed
}))

describe('SmartCodeAnalyzer Component', () => {
  const mockOnToggle = vi.fn()
  
  // Sample test data
  const sampleFileData = [
    {
      name: 'app.js',
      content: 'console.log("Hello World");',
      visible: true,
      path: 'src/app.js'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render when visible', () => {
    render(
      <ThemeContext.Provider value={{ darkMode: false, toggleDarkMode: vi.fn() }}>
        <SmartCodeAnalyzer 
          fileData={sampleFileData}
          isVisible={true}
          onToggle={mockOnToggle}
        />
      </ThemeContext.Provider>
    )
    
    expect(screen.getByText('Code Analysis')).toBeInTheDocument()
  })

  it('should not render when not visible', () => {
    render(
      <ThemeContext.Provider value={{ darkMode: false, toggleDarkMode: vi.fn() }}>
        <SmartCodeAnalyzer 
          fileData={sampleFileData}
          isVisible={false}
          onToggle={mockOnToggle}
        />
      </ThemeContext.Provider>
    )
    
    expect(screen.queryByText('Code Analysis')).not.toBeInTheDocument()
  })

  it('should call onToggle when close button is clicked', () => {
    render(
      <ThemeContext.Provider value={{ darkMode: false, toggleDarkMode: vi.fn() }}>
        <SmartCodeAnalyzer 
          fileData={sampleFileData}
          isVisible={true}
          onToggle={mockOnToggle}
        />
      </ThemeContext.Provider>
    )
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    
    expect(mockOnToggle).toHaveBeenCalledTimes(1)
  })
})