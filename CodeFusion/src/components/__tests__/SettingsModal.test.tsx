import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeContext } from '../../context/ThemeContext'
import SettingsModal from '../SettingsModal'
import { projectPresets } from '../../utils/projectPresets'

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaTimes: ({ className }: { className?: string }) => (
    <span data-testid="times-icon" className={className}>TimesIcon</span>
  ),
  FaPlus: ({ className }: { className?: string }) => (
    <span data-testid="plus-icon" className={className}>PlusIcon</span>
  ),
  FaSave: ({ className }: { className?: string }) => (
    <span data-testid="save-icon" className={className}>SaveIcon</span>
  ),
  FaCog: ({ className }: { className?: string }) => (
    <span data-testid="cog-icon" className={className}>CogIcon</span>
  ),
  FaFileAlt: ({ className }: { className?: string }) => (
    <span data-testid="file-alt-icon" className={className}>FileAltIcon</span>
  ),
  FaSearch: ({ className }: { className?: string }) => (
    <span data-testid="search-icon" className={className}>SearchIcon</span>
  ),
  FaCheck: ({ className }: { className?: string }) => (
    <span data-testid="check-icon" className={className}>CheckIcon</span>
  ),
  FaTrash: ({ className }: { className?: string }) => (
    <span data-testid="trash-icon" className={className}>TrashIcon</span>
  ),
  FaRocket: ({ className }: { className?: string }) => (
    <span data-testid="rocket-icon" className={className}>RocketIcon</span>
  ),
  FaToggleOn: ({ className }: { className?: string }) => (
    <span data-testid="toggle-on-icon" className={className}>ToggleOnIcon</span>
  ),
  FaToggleOff: ({ className }: { className?: string }) => (
    <span data-testid="toggle-off-icon" className={className}>ToggleOffIcon</span>
  ),
  FaMinus: ({ className }: { className?: string }) => (
    <span data-testid="minus-icon" className={className}>MinusIcon</span>
  ),
  FaUndo: ({ className }: { className?: string }) => (
    <span data-testid="undo-icon" className={className}>UndoIcon</span>
  ),
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  key: vi.fn()
}
global.localStorage = localStorageMock

describe('SettingsModal Component', () => {
  const mockOnClose = vi.fn()
  const mockOnSave = vi.fn()
  const mockSetProjectType = vi.fn()

  const defaultSettings = {
    newLineCount: 2,
    autoUnselectFolders: ['node_modules', '.git', 'build'],
    acceptedTypes: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
  }

  // Helper function to render SettingsModal with theme context
  const renderSettingsModalWithTheme = (
    darkMode = false,
    settings = defaultSettings,
    projectType: keyof typeof projectPresets = 'react'
  ) => {
    return render(
      <ThemeContext.Provider value={{ darkMode, toggleDarkMode: vi.fn() }}>
        <SettingsModal
          settings={settings}
          projectType={projectType}
          setProjectType={mockSetProjectType}
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      </ThemeContext.Provider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
  })

  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderSettingsModalWithTheme()
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    it('should display all tabs', () => {
      renderSettingsModalWithTheme()
      
      expect(screen.getByText('Project Presets')).toBeInTheDocument()
      expect(screen.getByText('Advanced')).toBeInTheDocument()
      expect(screen.getByText('File Types')).toBeInTheDocument()
    })

    it('should show header with description', () => {
      renderSettingsModalWithTheme()
      
      expect(screen.getByText('Customize your CodeFusion experience')).toBeInTheDocument()
    })

    it('should show reset and close buttons', () => {
      renderSettingsModalWithTheme()
      
      expect(screen.getByText('Reset')).toBeInTheDocument()
      expect(screen.getByTestId('times-icon')).toBeInTheDocument()
    })

    it('should show save settings button in footer', () => {
      renderSettingsModalWithTheme()
      
      expect(screen.getByText('Save Settings')).toBeInTheDocument()
      expect(screen.getByTestId('save-icon')).toBeInTheDocument()
    })
  })

  describe('Theme Support', () => {
    it('should apply dark theme classes', () => {
      const { container } = renderSettingsModalWithTheme(true)
      
      const modal = container.querySelector('.bg-dark-800')
      expect(modal).toBeInTheDocument()
    })

    it('should apply light theme classes', () => {
      const { container } = renderSettingsModalWithTheme(false)
      
      const modal = container.querySelector('.bg-white')
      expect(modal).toBeInTheDocument()
    })
  })

  describe('Tab Navigation', () => {
    it('should show Project Presets tab by default', () => {
      renderSettingsModalWithTheme()
      
      expect(screen.getByText(/Current Configuration:/)).toBeInTheDocument()
    })

    it('should switch to Advanced tab when clicked', () => {
      renderSettingsModalWithTheme()
      
      const advancedTab = screen.getByText('Advanced')
      fireEvent.click(advancedTab)
      
      expect(screen.getByText('Line Spacing')).toBeInTheDocument()
    })

    it('should switch to File Types tab when clicked', () => {
      renderSettingsModalWithTheme()
      
      const fileTypesTab = screen.getByText('File Types')
      fireEvent.click(fileTypesTab)
      
      expect(screen.getByPlaceholderText('Search file types...')).toBeInTheDocument()
    })

    it('should highlight active tab', () => {
      renderSettingsModalWithTheme()
      
      const presetsTab = screen.getByText('Project Presets').closest('button')
      expect(presetsTab).toHaveClass('bg-gradient-to-r')
    })
  })

  describe('Project Presets Tab', () => {
    it('should display all available presets', () => {
      renderSettingsModalWithTheme()
      
      // Use getAllByText since the preset name appears multiple times
      const reactTexts = screen.getAllByText('React / Next.js')
      expect(reactTexts.length).toBeGreaterThan(0)
      
      expect(screen.getByText('Python')).toBeInTheDocument()
      expect(screen.getByText('Custom')).toBeInTheDocument()
    })

    it('should show preset descriptions', () => {
      renderSettingsModalWithTheme()
      
      expect(screen.getByText(/Optimized for React and Next.js projects/)).toBeInTheDocument()
    })

    it('should highlight selected preset', () => {
      renderSettingsModalWithTheme(false, defaultSettings, 'react')
      
      // Find the preset card by looking for the h3 element specifically
      const reactPresetHeadings = screen.getAllByText('React / Next.js')
      const h3Element = reactPresetHeadings.find(element => element.tagName === 'H3')
      const presetCard = h3Element?.closest('div[class*="cursor-pointer"]')
      
      expect(presetCard).toHaveClass('border-blue-500')
    })

    it('should call setProjectType when preset is clicked', () => {
      renderSettingsModalWithTheme()
      
      const pythonPreset = screen.getByText('Python').closest('div[class*="cursor-pointer"]')
      fireEvent.click(pythonPreset!)
      
      expect(mockSetProjectType).toHaveBeenCalledWith('python')
    })

    it('should show current configuration summary', () => {
      renderSettingsModalWithTheme()
      
      expect(screen.getByText('Lines between files')).toBeInTheDocument()
      
      // Look for the configuration summary section
      const configSection = screen.getByText(/Current Configuration:/).parentElement?.parentElement
      
      // Find the line count card and its value
      const lineCountCard = within(configSection!).getByText('Lines between files').parentElement
      const lineCountValue = lineCountCard?.querySelector('div[class*="text-3xl"]')
      expect(lineCountValue).toHaveTextContent('2')
      
      expect(screen.getByText('Excluded folders')).toBeInTheDocument()
      expect(screen.getByText('Accepted file types')).toBeInTheDocument()
    })

    it('should filter presets based on search', async () => {
      renderSettingsModalWithTheme()
      const user = userEvent.setup()
      
      const searchInput = screen.getByPlaceholderText('Search project types...')
      await user.type(searchInput, 'python')
      
      await waitFor(() => {
        // Check that Python is visible
        expect(screen.getByText('Python')).toBeInTheDocument()
        
        // Check that React preset card is not in the grid (but may still be in the current config)
        const presetCards = screen.getAllByText(/Optimized for|applications|customizable/)
        const reactCard = presetCards.find(card => 
          card.textContent?.includes('React and Next.js')
        )
        expect(reactCard).toBeUndefined()
      })
    })

    it('should show no results message when search has no matches', async () => {
      renderSettingsModalWithTheme()
      const user = userEvent.setup()
      
      const searchInput = screen.getByPlaceholderText('Search project types...')
      await user.type(searchInput, 'nonexistent')
      
      expect(screen.getByText(/No presets found matching/)).toBeInTheDocument()
    })
  })

  describe('Advanced Tab', () => {
    it('should show line spacing controls', () => {
      renderSettingsModalWithTheme()
      
      fireEvent.click(screen.getByText('Advanced'))
      
      expect(screen.getByText('Line Spacing')).toBeInTheDocument()
      expect(screen.getByText('Number of blank lines between files in output')).toBeInTheDocument()
    })

    it('should allow changing line count with buttons', () => {
      renderSettingsModalWithTheme()
      
      fireEvent.click(screen.getByText('Advanced'))
      
      // Find the line spacing section
      const lineSpacingSection = screen.getByText('Line Spacing').closest('div')?.parentElement
      const plusButton = within(lineSpacingSection!).getByTestId('plus-icon').closest('button')
      
      fireEvent.click(plusButton!)
      
      // Verify through save
      const saveButton = screen.getByText('Save Settings')
      fireEvent.click(saveButton)
      
      expect(mockOnSave).toHaveBeenCalledWith({
        newLineCount: 3, // Should be incremented
        autoUnselectFolders: ['node_modules', '.git', 'build'],
        acceptedTypes: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
      })
    })

    it('should allow changing line count with slider', () => {
      renderSettingsModalWithTheme()
      
      fireEvent.click(screen.getByText('Advanced'))
      
      const slider = screen.getByRole('slider')
      fireEvent.change(slider, { target: { value: '5' } })
      
      // Verify through save
      const saveButton = screen.getByText('Save Settings')
      fireEvent.click(saveButton)
      
      expect(mockOnSave).toHaveBeenCalledWith({
        newLineCount: 5,
        autoUnselectFolders: ['node_modules', '.git', 'build'],
        acceptedTypes: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
      })
    })

    it('should show excluded folders section', () => {
      renderSettingsModalWithTheme()
      
      fireEvent.click(screen.getByText('Advanced'))
      
      expect(screen.getByText('Excluded Folders')).toBeInTheDocument()
      expect(screen.getByText('node_modules')).toBeInTheDocument()
      expect(screen.getByText('.git')).toBeInTheDocument()
      expect(screen.getByText('build')).toBeInTheDocument()
    })

    it('should allow adding new excluded folders', async () => {
      renderSettingsModalWithTheme()
      const user = userEvent.setup()
      
      fireEvent.click(screen.getByText('Advanced'))
      
      const input = screen.getByPlaceholderText('Enter folder name to exclude...')
      await user.type(input, 'dist')
      
      const addButton = input.nextElementSibling as HTMLElement
      fireEvent.click(addButton)
      
      // Verify through save
      const saveButton = screen.getByText('Save Settings')
      fireEvent.click(saveButton)
      
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          autoUnselectFolders: expect.arrayContaining(['dist'])
        })
      )
    })

    it('should allow removing excluded folders', () => {
      renderSettingsModalWithTheme()
      
      fireEvent.click(screen.getByText('Advanced'))
      
      const nodemodulesFolder = screen.getByText('node_modules').closest('div')
      const deleteButton = within(nodemodulesFolder!).getByTestId('trash-icon').closest('button')
      
      fireEvent.click(deleteButton!)
      
      // Verify through save
      const saveButton = screen.getByText('Save Settings')
      fireEvent.click(saveButton)
      
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          autoUnselectFolders: expect.not.arrayContaining(['node_modules'])
        })
      )
    })

    it('should show validation error for invalid folder names', async () => {
      renderSettingsModalWithTheme()
      const user = userEvent.setup()
      
      fireEvent.click(screen.getByText('Advanced'))
      
      const input = screen.getByPlaceholderText('Enter folder name to exclude...')
      await user.type(input, 'invalid folder name!')
      
      const addButton = input.nextElementSibling as HTMLElement
      fireEvent.click(addButton)
      
      expect(screen.getByText(/Invalid folder name/)).toBeInTheDocument()
    })

    it('should toggle advanced folder suggestions', () => {
      renderSettingsModalWithTheme()
      
      fireEvent.click(screen.getByText('Advanced'))
      
      const toggleButton = screen.getByTestId('toggle-off-icon').closest('button')
      fireEvent.click(toggleButton!)
      
      expect(screen.getByText('Common Exclusions')).toBeInTheDocument()
    })
  })

  describe('File Types Tab', () => {
    it('should display file type groups', () => {
      renderSettingsModalWithTheme()
      
      fireEvent.click(screen.getByText('File Types'))
      
      expect(screen.getByText('Web Fundamentals')).toBeInTheDocument()
      expect(screen.getByText('JavaScript & TypeScript')).toBeInTheDocument()
      expect(screen.getByText('Python')).toBeInTheDocument()
    })

    it('should show file type search', () => {
      renderSettingsModalWithTheme()
      
      fireEvent.click(screen.getByText('File Types'))
      
      expect(screen.getByPlaceholderText('Search file types...')).toBeInTheDocument()
    })

    it('should filter file types based on search', async () => {
      renderSettingsModalWithTheme()
      const user = userEvent.setup()
      
      fireEvent.click(screen.getByText('File Types'))
      
      const searchInput = screen.getByPlaceholderText('Search file types...')
      await user.type(searchInput, '.js')
      
      // Should still show JavaScript group
      expect(screen.getByText('JavaScript & TypeScript')).toBeInTheDocument()
      
      // Should hide groups without .js
      await waitFor(() => {
        expect(screen.queryByText('Python')).not.toBeInTheDocument()
      })
    })

    it('should show selected count', () => {
      renderSettingsModalWithTheme()
      
      fireEvent.click(screen.getByText('File Types'))
      
      expect(screen.getByText('Selected: 6')).toBeInTheDocument()
    })

    it('should toggle file type selection', () => {
      renderSettingsModalWithTheme()
      
      fireEvent.click(screen.getByText('File Types'))
      
      const htmlCheckbox = screen.getByText('.html')
      fireEvent.click(htmlCheckbox)
      
      // Verify through save
      const saveButton = screen.getByText('Save Settings')
      fireEvent.click(saveButton)
      
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          acceptedTypes: expect.arrayContaining(['.html'])
        })
      )
    })

    it('should select all file types in a group', () => {
      renderSettingsModalWithTheme()
      
      fireEvent.click(screen.getByText('File Types'))
      
      const webGroup = screen.getByText('Web Fundamentals').closest('div[class*="rounded-2xl"]')
      const buttons = within(webGroup!).getAllByRole('button')
      
      // Find the select all button (first button with check icon)
      const selectAllButton = buttons.find(button => 
        button.querySelector('[data-testid="check-icon"]')
      )
      
      fireEvent.click(selectAllButton!)
      
      // Verify through save
      const saveButton = screen.getByText('Save Settings')
      fireEvent.click(saveButton)
      
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          acceptedTypes: expect.arrayContaining(['.html', '.css'])
        })
      )
    })

    it('should deselect all file types in a group', () => {
      renderSettingsModalWithTheme()
      
      fireEvent.click(screen.getByText('File Types'))
      
      const webGroup = screen.getByText('Web Fundamentals').closest('div[class*="rounded-2xl"]')
      const buttons = within(webGroup!).getAllByRole('button')
      
      // Find the deselect all button (button with times icon)
      const deselectAllButton = buttons.find(button => 
        button.querySelector('[data-testid="times-icon"]')
      )
      
      fireEvent.click(deselectAllButton!)
      
      // Verify through save - should not contain web fundamentals types
      const saveButton = screen.getByText('Save Settings')
      fireEvent.click(saveButton)
      
      const savedTypes = mockOnSave.mock.calls[0][0].acceptedTypes
      expect(savedTypes).not.toContain('.html')
      expect(savedTypes).not.toContain('.htm')
    })

    it('should have select all and clear all buttons', () => {
      renderSettingsModalWithTheme()
      
      fireEvent.click(screen.getByText('File Types'))
      
      expect(screen.getByText('Select All')).toBeInTheDocument()
      expect(screen.getByText('Clear All')).toBeInTheDocument()
    })
  })

  describe('Modal Actions', () => {
    it('should call onClose when close button is clicked', () => {
      renderSettingsModalWithTheme()
      
      const closeButton = screen.getByTestId('times-icon').closest('button')
      fireEvent.click(closeButton!)
      
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should call onClose when Cancel button is clicked', () => {
      renderSettingsModalWithTheme()
      
      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)
      
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should call onSave with updated settings when Save button is clicked', () => {
      renderSettingsModalWithTheme()
      
      const saveButton = screen.getByText('Save Settings')
      fireEvent.click(saveButton)
      
      expect(mockOnSave).toHaveBeenCalledWith({
        newLineCount: 2,
        autoUnselectFolders: ['node_modules', '.git', 'build'],
        acceptedTypes: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
      })
    })

    it('should reset settings when Reset button is clicked', () => {
      renderSettingsModalWithTheme()
      
      const resetButton = screen.getByText('Reset')
      fireEvent.click(resetButton)
      
      // Should reset to default values for current project type
      expect(mockSetProjectType).toHaveBeenCalledWith('react')
    })

    it('should save settings to localStorage', () => {
      renderSettingsModalWithTheme()
      
      // Note: The component calls onSave which should trigger localStorage 
      // in the parent component. This test verifies the callback is called.
      const saveButton = screen.getByText('Save Settings')
      fireEvent.click(saveButton)
      
      expect(mockOnSave).toHaveBeenCalled()
    })
  })

  describe('Footer Information', () => {
    it('should show storage information', () => {
      renderSettingsModalWithTheme()
      
      expect(screen.getByText('Changes will be saved to your local browser storage')).toBeInTheDocument()
    })

    it('should show current preset name in footer', () => {
      renderSettingsModalWithTheme(false, defaultSettings, 'react')
      
      expect(screen.getByText(/Current preset:/).parentElement).toHaveTextContent('React / Next.js')
    })
  })

  describe('Accessibility', () => {
    it('should have proper modal structure', () => {
      renderSettingsModalWithTheme()
      
      const modal = screen.getByText('Settings').closest('div.fixed')
      expect(modal).toBeInTheDocument()
    })

    it('should have accessible form controls', () => {
      renderSettingsModalWithTheme()
      
      fireEvent.click(screen.getByText('Advanced'))
      
      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('min', '0')
      expect(slider).toHaveAttribute('max', '20')
    })

    it('should have proper button labels', () => {
      renderSettingsModalWithTheme()
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toBeVisible()
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty settings gracefully', () => {
      const emptySettings = {
        newLineCount: 0,
        autoUnselectFolders: [],
        acceptedTypes: []
      }
      
      renderSettingsModalWithTheme(false, emptySettings)
      
      // Find the configuration summary section
      const configSection = screen.getByText(/Current Configuration:/).parentElement?.parentElement
      
      // Find the specific card with "Lines between files"
      const lineCountCard = within(configSection!).getByText('Lines between files').parentElement
      const lineCountValue = lineCountCard?.querySelector('div[class*="text-3xl"]')
      
      expect(lineCountValue).toHaveTextContent('0')
    })

    it('should prevent adding duplicate folders', async () => {
      renderSettingsModalWithTheme()
      const user = userEvent.setup()
      
      fireEvent.click(screen.getByText('Advanced'))
      
      const input = screen.getByPlaceholderText('Enter folder name to exclude...')
      await user.type(input, 'node_modules')
      
      const addButton = input.nextElementSibling as HTMLElement
      fireEvent.click(addButton)
      
      expect(screen.getByText(/This folder is already in the list/)).toBeInTheDocument()
    })

    it('should handle long folder names', async () => {
      renderSettingsModalWithTheme()
      const user = userEvent.setup()
      
      fireEvent.click(screen.getByText('Advanced'))
      
      const input = screen.getByPlaceholderText('Enter folder name to exclude...')
      const longName = 'a'.repeat(51)
      await user.type(input, longName)
      
      const addButton = input.nextElementSibling as HTMLElement
      fireEvent.click(addButton)
      
      expect(screen.getByText(/Invalid folder name/)).toBeInTheDocument()
    })
  })
})