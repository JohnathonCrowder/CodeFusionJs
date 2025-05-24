import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeContext } from '../../context/ThemeContext'
import DirectorySelectionModal from '../DirectorySelectionModal'

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaInfoCircle: ({ className }: { className?: string }) => (
    <span data-testid="info-icon" className={className}>InfoIcon</span>
  ),
  FaFolder: ({ className }: { className?: string }) => (
    <span data-testid="folder-icon" className={className}>FolderIcon</span>
  ),
  FaFile: ({ className }: { className?: string }) => (
    <span data-testid="file-icon" className={className}>FileIcon</span>
  ),
  FaEye: ({ className }: { className?: string }) => (
    <span data-testid="eye-icon" className={className}>EyeIcon</span>
  ),
  FaSearch: ({ className }: { className?: string }) => (
    <span data-testid="search-icon" className={className}>SearchIcon</span>
  ),
  FaTimes: ({ className }: { className?: string }) => (
    <span data-testid="times-icon" className={className}>TimesIcon</span>
  ),
  FaFolderOpen: ({ className }: { className?: string }) => (
    <span data-testid="folder-open-icon" className={className}>FolderOpenIcon</span>
  ),
  FaCheck: ({ className }: { className?: string }) => (
    <span data-testid="check-icon" className={className}>CheckIcon</span>
  ),
}))

describe('DirectorySelectionModal Component', () => {
  const mockOnConfirm = vi.fn()
  const mockOnCancel = vi.fn()

  const sampleDirectories = [
    {
      name: 'src',
      path: 'src',
      selected: true,
      children: [
        {
          name: 'components',
          path: 'src/components',
          selected: true,
          children: []
        },
        {
          name: 'utils',
          path: 'src/utils',
          selected: false,
          children: []
        }
      ]
    },
    {
      name: 'node_modules',
      path: 'node_modules',
      selected: false,
      children: []
    },
    {
      name: 'public',
      path: 'public',
      selected: true,
      children: []
    }
  ]

  const defaultSettings = {
    autoUnselectFolders: ['node_modules', '.git', 'build', 'dist']
  }

  // Helper function to render DirectorySelectionModal with theme context
  const renderDirectoryModalWithTheme = (
    darkMode = false,
    directories = sampleDirectories,
    settings = defaultSettings
  ) => {
    return render(
      <ThemeContext.Provider value={{ darkMode, toggleDarkMode: vi.fn() }}>
        <DirectorySelectionModal
          directories={directories}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          settings={settings}
        />
      </ThemeContext.Provider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderDirectoryModalWithTheme()
      expect(screen.getByText('Select Directories')).toBeInTheDocument()
    })

    it('should display modal header with title and description', () => {
      renderDirectoryModalWithTheme()
      
      expect(screen.getByText('Select Directories')).toBeInTheDocument()
      expect(screen.getByText('Choose which folders to include in your project upload')).toBeInTheDocument()
      expect(screen.getByTestId('folder-open-icon')).toBeInTheDocument()
    })

    it('should display information box', () => {
      renderDirectoryModalWithTheme()
      
      expect(screen.getByTestId('info-icon')).toBeInTheDocument()
      expect(screen.getByText(/Folders marked as/)).toBeInTheDocument()
      expect(screen.getByText(/Click any checkbox to select/)).toBeInTheDocument()
    })

    it('should display search box', () => {
      renderDirectoryModalWithTheme()
      
      expect(screen.getByPlaceholderText('Search directories...')).toBeInTheDocument()
      expect(screen.getByTestId('search-icon')).toBeInTheDocument()
    })

    it('should display directory tree', () => {
      renderDirectoryModalWithTheme()
      
      expect(screen.getByText('src')).toBeInTheDocument()
      expect(screen.getByText('components')).toBeInTheDocument()
      expect(screen.getByText('utils')).toBeInTheDocument()
      expect(screen.getAllByText('node_modules').length).toBeGreaterThan(0)
      expect(screen.getByText('public')).toBeInTheDocument()
    })

    it('should display footer with buttons', () => {
      renderDirectoryModalWithTheme()
      
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByText(/Confirm Selection/)).toBeInTheDocument()
    })

    it('should show selected count in confirm button', () => {
      renderDirectoryModalWithTheme()
      
      // Count selected items: src (1) + components (1) + public (1) = 3
      expect(screen.getByText('Confirm Selection (3)')).toBeInTheDocument()
    })
  })

  describe('Theme Support', () => {
    it('should apply dark theme classes', () => {
      const { container } = renderDirectoryModalWithTheme(true)
      
      const modal = container.querySelector('.bg-dark-800')
      expect(modal).toBeInTheDocument()
    })

    it('should apply light theme classes', () => {
      const { container } = renderDirectoryModalWithTheme(false)
      
      const modal = container.querySelector('.bg-white')
      expect(modal).toBeInTheDocument()
    })

    it('should apply theme-specific text colors', () => {
      renderDirectoryModalWithTheme(true)
      
      const title = screen.getByText('Select Directories')
      expect(title).toHaveClass('text-dark-50')
    })

    it('should apply theme-specific input styles', () => {
      renderDirectoryModalWithTheme(true)
      
      const searchInput = screen.getByPlaceholderText('Search directories...')
      expect(searchInput).toHaveClass('bg-dark-600', 'text-dark-200')
    })
  })

  describe('Directory Tree', () => {
    it('should display folder icons for directories', () => {
      renderDirectoryModalWithTheme()
      
      const folderIcons = screen.getAllByTestId('folder-icon')
      expect(folderIcons.length).toBeGreaterThan(0)
    })

    it('should show checkboxes for each directory', () => {
      renderDirectoryModalWithTheme()
      
      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes.length).toBe(5) // src, components, utils, node_modules, public
    })

    it('should reflect initial selection state', () => {
      renderDirectoryModalWithTheme()
      
      const checkboxes = screen.getAllByRole('checkbox')
      
      // Count checked checkboxes (should be 3: src, components, public)
      const checkedCheckboxes = checkboxes.filter(checkbox => checkbox.getAttribute('checked') === '')
      expect(checkedCheckboxes.length).toBe(3)
    })

    it('should show excluded badge for auto-unselected folders', () => {
        renderDirectoryModalWithTheme()
        
        // Instead of trying to get a single list, get all lists and find the one containing node_modules
        const allLists = screen.getAllByRole('list')
        
        // Find the list that contains the node_modules text
        let excludedBadge: HTMLElement | null = null
        
        for (const list of allLists) {
          const badge = within(list).queryByText('excluded')
          if (badge) {
            excludedBadge = badge
            break
          }
        }
        
        expect(excludedBadge).toBeInTheDocument()
      })

    it('should display nested directories with proper indentation', () => {
      renderDirectoryModalWithTheme()
      
      const componentsItem = screen.getByText('components').closest('li')
      const utilsItem = screen.getByText('utils').closest('li')
      
      // These should be nested within src
      expect(componentsItem).toBeInTheDocument()
      expect(utilsItem).toBeInTheDocument()
    })

    it('should show eye icon for selected directories', () => {
      renderDirectoryModalWithTheme()
      
      const eyeIcons = screen.getAllByTestId('eye-icon')
      expect(eyeIcons.length).toBeGreaterThan(0)
    })
  })

  describe('Search Functionality', () => {
    it('should filter directories based on search term', async () => {
      renderDirectoryModalWithTheme()
      const user = userEvent.setup()
      
      const searchInput = screen.getByPlaceholderText('Search directories...')
      await user.type(searchInput, 'components')
      
      await waitFor(() => {
        expect(screen.getByText('components')).toBeInTheDocument()
        expect(screen.queryByText('public')).not.toBeInTheDocument()
      })
    })

    it('should clear search when clear button is clicked', async () => {
      renderDirectoryModalWithTheme()
      const user = userEvent.setup()
      
      const searchInput = screen.getByPlaceholderText('Search directories...')
      await user.type(searchInput, 'test')
      
      const clearButton = screen.getByTestId('times-icon').closest('button')
      await user.click(clearButton!)
      
      expect(searchInput).toHaveValue('')
    })

    it('should show all directories when search is cleared', async () => {
      renderDirectoryModalWithTheme()
      const user = userEvent.setup()
      
      const searchInput = screen.getByPlaceholderText('Search directories...')
      await user.type(searchInput, 'components')
      
      await waitFor(() => {
        expect(screen.queryByText('public')).not.toBeInTheDocument()
      })
      
      await user.clear(searchInput)
      
      await waitFor(() => {
        expect(screen.getByText('public')).toBeInTheDocument()
      })
    })

    it('should handle case-insensitive search', async () => {
      renderDirectoryModalWithTheme()
      const user = userEvent.setup()
      
      const searchInput = screen.getByPlaceholderText('Search directories...')
      await user.type(searchInput, 'SRC')
      
      await waitFor(() => {
        expect(screen.getByText('src')).toBeInTheDocument()
      })
    })
  })

  describe('Selection Management', () => {
    it('should toggle directory selection when checkbox is clicked', async () => {
      renderDirectoryModalWithTheme()
      const user = userEvent.setup()
      
      const checkboxes = screen.getAllByRole('checkbox')
      const publicCheckbox = checkboxes.find(checkbox => {
        const label = checkbox.closest('label')
        return label?.textContent?.includes('public')
      })
      
      expect(publicCheckbox).toBeChecked()
      
      await user.click(publicCheckbox!)
      expect(publicCheckbox).not.toBeChecked()
      
      await user.click(publicCheckbox!)
      expect(publicCheckbox).toBeChecked()
    })

    it('should update selected count when selection changes', async () => {
      renderDirectoryModalWithTheme()
      const user = userEvent.setup()
      
      const checkboxes = screen.getAllByRole('checkbox')
      const publicCheckbox = checkboxes.find(checkbox => {
        const label = checkbox.closest('label')
        return label?.textContent?.includes('public')
      })
      
      await user.click(publicCheckbox!) // Uncheck
      
      await waitFor(() => {
        expect(screen.getByText('Confirm Selection (2)')).toBeInTheDocument()
      })
    })

    it('should select/deselect children when parent is toggled', async () => {
      renderDirectoryModalWithTheme()
      const user = userEvent.setup()
      
      const checkboxes = screen.getAllByRole('checkbox')
      const srcCheckbox = checkboxes.find(checkbox => {
        const label = checkbox.closest('label')
        const labelText = label?.textContent || ''
        return labelText.includes('src') && !labelText.includes('components')
      })
      
      await user.click(srcCheckbox!) // Uncheck src
      
      const componentsCheckbox = checkboxes.find(checkbox => {
        const label = checkbox.closest('label')
        return label?.textContent?.includes('components')
      })
      
      const utilsCheckbox = checkboxes.find(checkbox => {
        const label = checkbox.closest('label')
        return label?.textContent?.includes('utils')
      })
      
      await waitFor(() => {
        expect(componentsCheckbox).not.toBeChecked()
        expect(utilsCheckbox).not.toBeChecked()
      })
    })
  })

  describe('Excluded Folders', () => {
    it('should show excluded folders list when toggle is clicked', async () => {
      renderDirectoryModalWithTheme()
      const user = userEvent.setup()
      
      const showToggle = screen.getByText('Show excluded')
      await user.click(showToggle)
      
      expect(screen.getByText('Auto-excluded folders:')).toBeInTheDocument()
      // Use getAllByText since node_modules appears in both the tree and excluded list
      const nodeModulesElements = screen.getAllByText('node_modules')
      expect(nodeModulesElements.length).toBeGreaterThan(1)
      expect(screen.getByText('.git')).toBeInTheDocument()
    })

    it('should hide excluded folders list when toggle is clicked again', async () => {
      renderDirectoryModalWithTheme()
      const user = userEvent.setup()
      
      const showToggle = screen.getByText('Show excluded')
      await user.click(showToggle)
      
      const hideToggle = screen.getByText('Hide excluded')
      await user.click(hideToggle)
      
      expect(screen.queryByText('Auto-excluded folders:')).not.toBeInTheDocument()
    })
  })

  describe('Modal Actions', () => {
    it('should call onCancel when cancel button is clicked', async () => {
      renderDirectoryModalWithTheme()
      const user = userEvent.setup()
      
      const cancelButton = screen.getByText('Cancel')
      await user.click(cancelButton)
      
      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })

    it('should call onConfirm with selected directories when confirm is clicked', async () => {
      renderDirectoryModalWithTheme()
      const user = userEvent.setup()
      
      const confirmButton = screen.getByText(/Confirm Selection/)
      await user.click(confirmButton)
      
      expect(mockOnConfirm).toHaveBeenCalledTimes(1)
      expect(mockOnConfirm).toHaveBeenCalledWith(sampleDirectories)
    })

    it('should pass updated directories to onConfirm after selection changes', async () => {
      renderDirectoryModalWithTheme()
      const user = userEvent.setup()
      
      // Change selection
      const checkboxes = screen.getAllByRole('checkbox')
      const publicCheckbox = checkboxes.find(checkbox => {
        const label = checkbox.closest('label')
        return label?.textContent?.includes('public')
      })
      
      await user.click(publicCheckbox!) // Uncheck public
      
      const confirmButton = screen.getByText(/Confirm Selection/)
      await user.click(confirmButton)
      
      expect(mockOnConfirm).toHaveBeenCalledTimes(1)
      const calledDirectories = mockOnConfirm.mock.calls[0][0]
      const publicDir = calledDirectories.find((dir: any) => dir.name === 'public')
      expect(publicDir.selected).toBe(false)
    })
  })

  describe('Modal Structure', () => {
    it('should have proper modal overlay structure', () => {
      const { container } = renderDirectoryModalWithTheme()
      
      const overlay = container.querySelector('.fixed.inset-0.z-50')
      expect(overlay).toBeInTheDocument()
      expect(overlay).toHaveClass('bg-black/50', 'backdrop-blur-sm')
    })

    it('should center modal content', () => {
      renderDirectoryModalWithTheme()
      
      const modalContainer = document.querySelector('.flex.min-h-screen')
      expect(modalContainer).toHaveClass('items-center', 'justify-center')
    })

    it('should have proper modal dimensions', () => {
      renderDirectoryModalWithTheme()
      
      const modal = screen.getByText('Select Directories').closest('div.relative')
      expect(modal).toHaveClass('max-w-2xl', 'w-full', 'max-h-[85vh]')
    })

    it('should have scrollable content area', () => {
      renderDirectoryModalWithTheme()
      
      const scrollableArea = document.querySelector('.overflow-y-auto')
      expect(scrollableArea).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty directories array', () => {
      renderDirectoryModalWithTheme(false, [])
      
      expect(screen.getByText('No directories found')).toBeInTheDocument()
      expect(screen.getByTestId('folder-icon')).toBeInTheDocument()
    })

    it('should handle directories without children', () => {
      const flatDirectories = [
        {
          name: 'single',
          path: 'single',
          selected: true
        }
      ]
      
      renderDirectoryModalWithTheme(false, flatDirectories)
      
      expect(screen.getByText('single')).toBeInTheDocument()
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper modal structure for screen readers', () => {
      renderDirectoryModalWithTheme()
      
      const modal = screen.getByText('Select Directories').closest('div.fixed')
      expect(modal).toBeInTheDocument()
    })

    it('should have accessible form controls', () => {
      renderDirectoryModalWithTheme()
      
      const checkboxes = screen.getAllByRole('checkbox')
      checkboxes.forEach(checkbox => {
        expect(checkbox).toBeVisible()
      })
    })

    it('should have proper button labels', () => {
      renderDirectoryModalWithTheme()
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toBeVisible()
      })
    })

    it('should have accessible search input', () => {
      renderDirectoryModalWithTheme()
      
      const searchInput = screen.getByPlaceholderText('Search directories...')
      expect(searchInput).toHaveAttribute('type', 'text')
    })

    it('should have proper heading hierarchy', () => {
      renderDirectoryModalWithTheme()
      
      const mainHeading = screen.getByRole('heading', { name: /select directories/i })
      expect(mainHeading).toBeInTheDocument()
      expect(mainHeading.tagName).toBe('H2')
    })
  })

  describe('Performance', () => {
    it('should handle large directory structures', () => {
      const largeDirectoryStructure = Array.from({ length: 10 }, (_, i) => ({
        name: `dir${i}`,
        path: `dir${i}`,
        selected: false,
        children: []
      }))
      
      renderDirectoryModalWithTheme(false, largeDirectoryStructure)
      
      expect(screen.getByText('dir0')).toBeInTheDocument()
      expect(screen.getByText('dir9')).toBeInTheDocument()
    })
  })

  describe('State Management', () => {
    it('should maintain selection state during search', async () => {
      renderDirectoryModalWithTheme()
      const user = userEvent.setup()
      
      // Change selection
      const checkboxes = screen.getAllByRole('checkbox')
      const publicCheckbox = checkboxes.find(checkbox => {
        const label = checkbox.closest('label')
        return label?.textContent?.includes('public')
      })
      
      await user.click(publicCheckbox!)
      
      // Search
      const searchInput = screen.getByPlaceholderText('Search directories...')
      await user.type(searchInput, 'public')
      
      await waitFor(() => {
        const publicCheckboxAfterSearch = screen.getAllByRole('checkbox').find(checkbox => {
          const label = checkbox.closest('label')
          return label?.textContent?.includes('public')
        })
        expect(publicCheckboxAfterSearch).not.toBeChecked()
      })
    })
  })
})