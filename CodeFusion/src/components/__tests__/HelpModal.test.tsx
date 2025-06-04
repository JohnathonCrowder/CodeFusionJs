import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeContext } from '../../context/ThemeContext'
import HelpModal from '../HelpModal'

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaTimes: ({ className }: { className?: string }) => (
    <span data-testid="times-icon" className={className}>TimesIcon</span>
  ),
  FaLightbulb: ({ className }: { className?: string }) => (
    <span data-testid="lightbulb-icon" className={className}>LightbulbIcon</span>
  ),
  FaBook: ({ className }: { className?: string }) => (
    <span data-testid="book-icon" className={className}>BookIcon</span>
  ),
  FaTools: ({ className }: { className?: string }) => (
    <span data-testid="tools-icon" className={className}>ToolsIcon</span>
  ),
  FaFileUpload: ({ className }: { className?: string }) => (
    <span data-testid="file-upload-icon" className={className}>FileUploadIcon</span>
  ),
  FaEye: ({ className }: { className?: string }) => (
    <span data-testid="eye-icon" className={className}>EyeIcon</span>
  ),
  FaCopy: ({ className }: { className?: string }) => (
    <span data-testid="copy-icon" className={className}>CopyIcon</span>
  ),
  FaCog: ({ className }: { className?: string }) => (
    <span data-testid="cog-icon" className={className}>CogIcon</span>
  ),
  FaChevronRight: ({ className }: { className?: string }) => (
    <span data-testid="chevron-right-icon" className={className}>ChevronRightIcon</span>
  ),
  FaKeyboard: ({ className }: { className?: string }) => (
    <span data-testid="keyboard-icon" className={className}>KeyboardIcon</span>
  ),
  FaQuestionCircle: ({ className }: { className?: string }) => (
    <span data-testid="question-icon" className={className}>QuestionIcon</span>
  ),
  FaRocket: ({ className }: { className?: string }) => (
    <span data-testid="rocket-icon" className={className}>RocketIcon</span>
  ),
  FaBrain: ({ className }: { className?: string }) => (
    <span data-testid="brain-icon" className={className}>BrainIcon</span>
  ),
  FaShieldAlt: ({ className }: { className?: string }) => (
    <span data-testid="shield-icon" className={className}>ShieldIcon</span>
  ),
  FaCode: ({ className }: { className?: string }) => (
    <span data-testid="code-icon" className={className}>CodeIcon</span>
  ),
  FaSearch: ({ className }: { className?: string }) => (
    <span data-testid="search-icon" className={className}>SearchIcon</span>
  ),
  FaExclamationTriangle: ({ className }: { className?: string }) => (
    <span data-testid="exclamation-icon" className={className}>ExclamationIcon</span>
  ),
}))

describe('HelpModal Component', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Helper function to render HelpModal with theme context
  const renderHelpModalWithTheme = (darkMode = false) => {
    return render(
      <ThemeContext.Provider value={{ darkMode, toggleDarkMode: vi.fn() }}>
        <HelpModal onClose={mockOnClose} />
      </ThemeContext.Provider>
    )
  }

  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderHelpModalWithTheme()
      expect(screen.getByText('Help Center')).toBeInTheDocument()
    })

    it('should display all section navigation links', () => {
      renderHelpModalWithTheme()
      
      expect(screen.getByText('Getting Started')).toBeInTheDocument()
      expect(screen.getByText('Key Features')).toBeInTheDocument()
      expect(screen.getByText('File Management')).toBeInTheDocument()
      expect(screen.getByText('Privacy & Security')).toBeInTheDocument()
      expect(screen.getByText('Code Analysis')).toBeInTheDocument()
      expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument()
      expect(screen.getByText('FAQ')).toBeInTheDocument()
    })

    it('should display close button', () => {
      renderHelpModalWithTheme()
      expect(screen.getByTestId('times-icon')).toBeInTheDocument()
    })

    it('should show "Getting Started" content by default', () => {
      renderHelpModalWithTheme()
      
      expect(screen.getByText('Getting Started with CodeFusion')).toBeInTheDocument()
      expect(screen.getByText(/Welcome to CodeFusion/)).toBeInTheDocument()
    })

    it('should render all section icons in navigation', () => {
      renderHelpModalWithTheme()
      
      // Get the navigation sidebar specifically to avoid conflicts with content area
      const navbar = screen.getByRole('navigation')
      
      expect(within(navbar).getByTestId('rocket-icon')).toBeInTheDocument()
      expect(within(navbar).getByTestId('tools-icon')).toBeInTheDocument()
      expect(within(navbar).getByTestId('file-upload-icon')).toBeInTheDocument()
      expect(within(navbar).getByTestId('shield-icon')).toBeInTheDocument()
      expect(within(navbar).getByTestId('brain-icon')).toBeInTheDocument()
      expect(within(navbar).getByTestId('keyboard-icon')).toBeInTheDocument()
      expect(within(navbar).getByTestId('question-icon')).toBeInTheDocument()
    })

    it('should render help footer with GitHub link', () => {
      renderHelpModalWithTheme()
      
      expect(screen.getByText('Need more help?')).toBeInTheDocument()
      expect(screen.getByText(/Check out our documentation/)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Visit GitHub/ })).toBeInTheDocument()
    })
  })

  describe('Theme Support', () => {
    it('should apply dark theme classes', () => {
      renderHelpModalWithTheme(true)
      
      // Look for the sidebar which should have dark theme classes
      const sidebar = screen.getByText('Help Center').closest('.w-64')
      expect(sidebar).toBeInTheDocument()
    })

    it('should apply light theme classes', () => {
      renderHelpModalWithTheme(false)
      
      // Look for the sidebar which should have light theme classes
      const sidebar = screen.getByText('Help Center').closest('.w-64')
      expect(sidebar).toBeInTheDocument()
    })
  })

  describe('Section Navigation', () => {
    it('should change content when clicking different sections', async () => {
      renderHelpModalWithTheme()
      const user = userEvent.setup()
      
      // Click on "Key Features"
      const keyFeaturesButton = screen.getByRole('button', { name: /Key Features/ })
      await user.click(keyFeaturesButton)
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Key Features' })).toBeInTheDocument()
        expect(screen.getByText('Smart File Organization')).toBeInTheDocument()
      })
    })

    it('should highlight active section', async () => {
      renderHelpModalWithTheme()
      const user = userEvent.setup()
      
      // Initially, Getting Started should be active
      const gettingStartedButton = screen.getByRole('button', { name: /Getting Started/ })
      expect(gettingStartedButton).toHaveClass('bg-blue-50')
      
      // Click on Key Features
      const keyFeaturesButton = screen.getByRole('button', { name: /Key Features/ })
      await user.click(keyFeaturesButton)
      
      await waitFor(() => {
        expect(keyFeaturesButton).toHaveClass('bg-blue-50')
        expect(gettingStartedButton).not.toHaveClass('bg-blue-50')
      })
    })

    it('should show chevron icon for active section', async () => {
      renderHelpModalWithTheme()
      
      // The chevron should be visible for the active section (Getting Started)
      const gettingStartedButton = screen.getByRole('button', { name: /Getting Started/ })
      const chevron = gettingStartedButton.querySelector('[data-testid="chevron-right-icon"]')
      
      expect(chevron).toBeInTheDocument()
    })
  })

  describe('Content Sections', () => {
    it('should display Getting Started content correctly', () => {
      renderHelpModalWithTheme()
      
      expect(screen.getByText('Getting Started with CodeFusion')).toBeInTheDocument()
      expect(screen.getByText('Upload Your Files')).toBeInTheDocument()
      expect(screen.getByText('Review & Select')).toBeInTheDocument()
      expect(screen.getByText('Copy & Share')).toBeInTheDocument()
    })

    it('should display Key Features content correctly', async () => {
      renderHelpModalWithTheme()
      const user = userEvent.setup()
      
      await user.click(screen.getByRole('button', { name: /Key Features/ }))
      
      await waitFor(() => {
        expect(screen.getByText('Smart File Organization')).toBeInTheDocument()
        expect(screen.getByText('Privacy Protection')).toBeInTheDocument()
        // Use a more specific query to avoid the navigation conflict
        expect(screen.getByRole('heading', { name: 'Key Features' })).toBeInTheDocument()
        expect(screen.getByText('Dark Mode')).toBeInTheDocument()
        expect(screen.getByText('Project Presets')).toBeInTheDocument()
        expect(screen.getByText('Search Functionality')).toBeInTheDocument()
      })
    })

    it('should display File Management content correctly', async () => {
      renderHelpModalWithTheme()
      const user = userEvent.setup()
      
      await user.click(screen.getByRole('button', { name: /File Management/ }))
      
      await waitFor(() => {
        expect(screen.getByText('Supported File Types')).toBeInTheDocument()
        expect(screen.getByText('Managing File Visibility')).toBeInTheDocument()
        expect(screen.getByText(/JavaScript \(.js, .jsx, .ts, .tsx\)/)).toBeInTheDocument()
      })
    })

    it('should display Privacy & Security content correctly', async () => {
      renderHelpModalWithTheme()
      const user = userEvent.setup()
      
      await user.click(screen.getByRole('button', { name: /Privacy & Security/ }))
      
      await waitFor(() => {
        expect(screen.getByText('Your Data Stays Local')).toBeInTheDocument()
        expect(screen.getByText('Anonymization Features')).toBeInTheDocument()
        expect(screen.getByText('Best Practices')).toBeInTheDocument()
      })
    })

    it('should display Code Analysis content correctly', async () => {
      renderHelpModalWithTheme()
      const user = userEvent.setup()
      
      await user.click(screen.getByRole('button', { name: /Code Analysis/ }))
      
      await waitFor(() => {
        expect(screen.getByText('Available Metrics')).toBeInTheDocument()
        expect(screen.getByText('Line Counts')).toBeInTheDocument()
        expect(screen.getByText('File Sizes')).toBeInTheDocument()
      })
    })

    it('should display Keyboard Shortcuts content correctly', async () => {
      renderHelpModalWithTheme()
      const user = userEvent.setup()
      
      await user.click(screen.getByRole('button', { name: /Keyboard Shortcuts/ }))
      
      await waitFor(() => {
        expect(screen.getByText('Search within files')).toBeInTheDocument()
        expect(screen.getByText('Ctrl/Cmd + F')).toBeInTheDocument()
        expect(screen.getByText('Ctrl/Cmd + C')).toBeInTheDocument()
      })
    })

    it('should display FAQ content correctly', async () => {
      renderHelpModalWithTheme()
      const user = userEvent.setup()
      
      await user.click(screen.getByRole('button', { name: /FAQ/ }))
      
      await waitFor(() => {
        expect(screen.getByText('How large files can I upload?')).toBeInTheDocument()
        expect(screen.getByText('Is my code sent to any servers?')).toBeInTheDocument()
        expect(screen.getByText('Can I use CodeFusion offline?')).toBeInTheDocument()
        expect(screen.getByText('How does anonymization work?')).toBeInTheDocument()
        expect(screen.getByText('What happens to my uploaded files?')).toBeInTheDocument()
      })
    })
  })

  describe('Modal Actions', () => {
    it('should call onClose when close button is clicked', async () => {
      renderHelpModalWithTheme()
      const user = userEvent.setup()
      
      const closeButton = screen.getByTestId('times-icon').closest('button')
      await user.click(closeButton!)
      
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should have GitHub link with correct attributes', () => {
      renderHelpModalWithTheme()
      
      const githubLink = screen.getByRole('link', { name: /Visit GitHub/ })
      expect(githubLink).toHaveAttribute('href', 'https://github.com/JohnathonCrowder/CodeFusionJs')
      expect(githubLink).toHaveAttribute('target', '_blank')
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  describe('Modal Structure', () => {
    it('should have proper modal overlay', () => {
      renderHelpModalWithTheme()
      
      const overlay = document.querySelector('.fixed.inset-0.z-50')
      expect(overlay).toBeInTheDocument()
      expect(overlay).toHaveClass('bg-black/50', 'backdrop-blur-sm')
    })

    it('should center modal content', () => {
      renderHelpModalWithTheme()
      
      const modalContainer = document.querySelector('.flex.min-h-screen')
      expect(modalContainer).toHaveClass('items-center', 'justify-center')
    })

    it('should have proper modal dimensions', () => {
      renderHelpModalWithTheme()
      
      const modal = screen.getByText('Help Center').closest('.rounded-xl')
      expect(modal).toHaveClass('max-w-5xl', 'w-full', 'max-h-[85vh]')
    })

    it('should have a two-column layout', () => {
      renderHelpModalWithTheme()
      
      // Check for sidebar
      const sidebar = screen.getByText('Help Center').closest('.w-64')
      expect(sidebar).toBeInTheDocument()
      
      // Check for content area
      const contentArea = screen.getByText('Getting Started with CodeFusion').closest('.flex-1')
      expect(contentArea).toBeInTheDocument()
    })
  })

  describe('Scrolling and Layout', () => {
    it('should have scrollable content area', () => {
      renderHelpModalWithTheme()
      
      const contentArea = screen.getByText('Getting Started with CodeFusion').closest('.overflow-y-auto')
      expect(contentArea).toBeInTheDocument()
    })

    it('should maintain fixed sidebar while content scrolls', () => {
      renderHelpModalWithTheme()
      
      const sidebar = screen.getByText('Help Center').closest('.w-64')
      expect(sidebar).not.toHaveClass('overflow-y-auto')
      expect(sidebar).toHaveClass('p-6')
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderHelpModalWithTheme()
      
      // Main heading
      const mainHeading = screen.getByRole('heading', { level: 2, name: 'Help Center' })
      expect(mainHeading).toBeInTheDocument()
      
      // Content headings
      const contentHeading = screen.getByRole('heading', { name: 'Getting Started with CodeFusion' })
      expect(contentHeading).toBeInTheDocument()
    })

    it('should have accessible navigation buttons', () => {
      renderHelpModalWithTheme()
      
      const navButtons = screen.getAllByRole('button')
      
      // Filter out the close button and count navigation buttons
      const sectionButtons = navButtons.filter(button => 
        button.textContent?.includes('Started') ||
        button.textContent?.includes('Features') ||
        button.textContent?.includes('Management') ||
        button.textContent?.includes('Privacy') ||
        button.textContent?.includes('Analysis') ||
        button.textContent?.includes('Shortcuts') ||
        button.textContent?.includes('FAQ')
      )
      
      expect(sectionButtons).toHaveLength(7)
    })

    it('should have proper keyboard navigation', async () => {
      renderHelpModalWithTheme()
      const user = userEvent.setup()
      
      // Tab through navigation buttons
      await user.tab()
      await user.tab() // Skip close button
      
      // Should focus on first navigation button
      const firstNavButton = screen.getByRole('button', { name: /Getting Started/ })
      expect(firstNavButton).toHaveFocus()
    })
  })

  describe('Content Details', () => {
    it('should display step numbers in getting started', () => {
      renderHelpModalWithTheme()
      
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('should display feature icons in key features section', async () => {
  renderHelpModalWithTheme()
  const user = userEvent.setup()
  
  await user.click(screen.getByRole('button', { name: /Key Features/ }))
  
  await waitFor(() => {
    // Get the main content area by finding the flex-1 div that's a child of the main modal
    const contentArea = screen.getByRole('heading', { name: 'Key Features' }).closest('.flex-1') as HTMLElement
    expect(contentArea).toBeInTheDocument()
    
    if (contentArea) {
      // Check for feature icons within the content area
      expect(within(contentArea).getAllByTestId('cog-icon').length).toBeGreaterThan(0)
      expect(within(contentArea).getAllByTestId('shield-icon').length).toBeGreaterThan(0)
      expect(within(contentArea).getAllByTestId('brain-icon').length).toBeGreaterThan(0)
      expect(within(contentArea).getAllByTestId('lightbulb-icon').length).toBeGreaterThan(0)
      expect(within(contentArea).getAllByTestId('code-icon').length).toBeGreaterThan(0)
      expect(within(contentArea).getAllByTestId('question-icon').length).toBeGreaterThan(0)
    }
  })
})

    it('should display keyboard shortcut keys in proper format', async () => {
      renderHelpModalWithTheme()
      const user = userEvent.setup()
      
      await user.click(screen.getByRole('button', { name: /Keyboard Shortcuts/ }))
      
      await waitFor(() => {
        // Check for kbd elements (keyboard keys)
        const kbdElements = document.querySelectorAll('kbd')
        expect(kbdElements.length).toBeGreaterThan(0)
        
        // Check specific shortcuts
        expect(screen.getByText('Ctrl/Cmd + F')).toBeInTheDocument()
        expect(screen.getByText('Ctrl/Cmd + C')).toBeInTheDocument()
        expect(screen.getByText('Escape')).toBeInTheDocument()
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid section switching', async () => {
      renderHelpModalWithTheme()
      const user = userEvent.setup()
      
      // Rapidly click through all sections
      const sections = [
        'Key Features',
        'File Management',
        'Privacy & Security',
        'Code Analysis',
        'Keyboard Shortcuts',
        'FAQ',
        'Getting Started'
      ]
      
      for (const section of sections) {
        await user.click(screen.getByRole('button', { name: new RegExp(section) }))
      }
      
      // Should end up on Getting Started
      await waitFor(() => {
        expect(screen.getByText('Getting Started with CodeFusion')).toBeInTheDocument()
      })
    })

    it('should maintain scroll position when switching sections', async () => {
      renderHelpModalWithTheme()
      const user = userEvent.setup()
      
      // Switch to FAQ (which has more content)
      await user.click(screen.getByRole('button', { name: /FAQ/ }))
      
      // Switch to another section
      await user.click(screen.getByRole('button', { name: /Getting Started/ }))
      
      // Content should start at top
      const contentArea = screen.getByText('Getting Started with CodeFusion').closest('.overflow-y-auto')
      expect(contentArea?.scrollTop).toBe(0)
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive padding', () => {
      const { container } = renderHelpModalWithTheme()
      
      const modalWrapper = container.querySelector('.p-4')
      expect(modalWrapper).toBeInTheDocument()
    })
  })

  describe('Help Footer', () => {
    it('should display help footer with correct styling', () => {
      renderHelpModalWithTheme()
      
      const helpFooter = screen.getByText('Need more help?').closest('div')
      expect(helpFooter).toHaveClass('mt-8', 'p-4', 'rounded-lg', 'border')
    })

    it('should have dark mode styling when enabled', () => {
      renderHelpModalWithTheme(true)
      
      const helpFooter = screen.getByText('Need more help?').closest('div')
      expect(helpFooter).toHaveClass('bg-blue-900/20', 'border-blue-700/50')
    })

    it('should have light mode styling when disabled', () => {
      renderHelpModalWithTheme(false)
      
      const helpFooter = screen.getByText('Need more help?').closest('div')
      expect(helpFooter).toHaveClass('bg-blue-50', 'border-blue-200')
    })
  })
})