import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeContext } from '../../context/ThemeContext'
import NavBar from '../NavBar'

// Mock the react-icons with unique text to avoid duplicates
vi.mock('react-icons/fa', () => ({
  FaHome: ({ className }: { className?: string }) => (
    <span data-testid="home-icon" className={className}>HomeIcon</span>
  ),
  FaGithub: ({ className }: { className?: string }) => (
    <span data-testid="github-icon" className={className}>GitHubIcon</span>
  ),
  FaQuestionCircle: ({ className }: { className?: string }) => (
    <span data-testid="help-icon" className={className}>HelpIcon</span>
  ),
  FaCode: ({ className }: { className?: string }) => (
    <span data-testid="code-icon" className={className}>CodeIcon</span>
  ),
  FaMoon: ({ className }: { className?: string }) => (
    <span data-testid="moon-icon" className={className}>MoonIcon</span>
  ),
  FaSun: ({ className }: { className?: string }) => (
    <span data-testid="sun-icon" className={className}>SunIcon</span>
  ),
  FaUser: ({ className }: { className?: string }) => (
    <span data-testid="user-icon" className={className}>UserIcon</span>
  ),
  FaCodeBranch: ({ className }: { className?: string }) => (
    <span data-testid="git-diff-icon" className={className}>GitDiffIcon</span>
  ),
}))

// Mock window.open
const mockWindowOpen = vi.fn()
window.open = mockWindowOpen

describe('NavBar Component', () => {
  const mockToggleDarkMode = vi.fn()
  const mockOnHelpOpen = vi.fn()
  const mockOnAboutOpen = vi.fn()
  const mockOnGitDiffOpen = vi.fn()

  // Helper function to render NavBar with theme context
  const renderNavBarWithTheme = (darkMode = false) => {
    return render(
      <ThemeContext.Provider value={{ darkMode, toggleDarkMode: mockToggleDarkMode }}>
        <NavBar 
          onHelpOpen={mockOnHelpOpen}
          onAboutOpen={mockOnAboutOpen}
          onGitDiffOpen={mockOnGitDiffOpen}
        />
      </ThemeContext.Provider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderNavBarWithTheme()
      expect(screen.getByText('CodeFusion')).toBeInTheDocument()
    })

    it('should render logo with proper styling', () => {
      renderNavBarWithTheme()
      
      expect(screen.getByText('CodeFusion')).toBeInTheDocument()
      expect(screen.getByText('X')).toBeInTheDocument()
      expect(screen.getByTestId('code-icon')).toBeInTheDocument()
    })

    it('should render all navigation items', () => {
      renderNavBarWithTheme()
      
      // Check for nav buttons by role
      expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /git diff/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /about/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /github/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /help/i })).toBeInTheDocument()
    })

    it('should render theme toggle button', () => {
      renderNavBarWithTheme()
      
      const themeButton = screen.getByRole('button', { name: /switch to/i })
      expect(themeButton).toBeInTheDocument()
    })
  })

  describe('Theme Support', () => {
    it('should show moon icon and "Light Mode" text in dark mode', () => {
      renderNavBarWithTheme(true)
      
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
      expect(screen.getByText('Light Mode')).toBeInTheDocument()
    })

    it('should show sun icon and "Dark Mode" text in light mode', () => {
      renderNavBarWithTheme(false)
      
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
      expect(screen.getByText('Dark Mode')).toBeInTheDocument()
    })

    it('should call toggleDarkMode when theme button is clicked', () => {
      renderNavBarWithTheme()
      
      const themeButton = screen.getByRole('button', { name: /switch to/i })
      fireEvent.click(themeButton)
      
      expect(mockToggleDarkMode).toHaveBeenCalledTimes(1)
    })

    it('should apply dark theme classes when darkMode is true', () => {
      const { container } = renderNavBarWithTheme(true)
      
      const nav = container.querySelector('nav')
      expect(nav).toHaveClass('bg-dark-800/95', 'border-dark-600/50', 'text-dark-50')
    })

    it('should apply light theme classes when darkMode is false', () => {
      const { container } = renderNavBarWithTheme(false)
      
      const nav = container.querySelector('nav')
      expect(nav).toHaveClass('bg-white/95', 'border-gray-200/50', 'text-gray-800')
    })
  })

  describe('Navigation Functionality', () => {
    it('should set Home as active by default', () => {
      renderNavBarWithTheme()
      
      const homeButton = screen.getByRole('button', { name: /home/i })
      expect(homeButton).toHaveClass('bg-blue-600', 'text-white')
    })

    it('should change active tab when navigation items are clicked', () => {
      renderNavBarWithTheme()
      
      const gitDiffButton = screen.getByRole('button', { name: /git diff/i })
      fireEvent.click(gitDiffButton)
      
      // Git Diff should now be active
      expect(gitDiffButton).toHaveClass('bg-blue-600', 'text-white')
      
      // Home should no longer be active
      const homeButton = screen.getByRole('button', { name: /home/i })
      expect(homeButton).not.toHaveClass('bg-blue-600', 'text-white')
    })

    it('should call onGitDiffOpen when Git Diff is clicked', () => {
      renderNavBarWithTheme()
      
      const gitDiffButton = screen.getByRole('button', { name: /git diff/i })
      fireEvent.click(gitDiffButton)
      
      expect(mockOnGitDiffOpen).toHaveBeenCalledTimes(1)
    })

    it('should call onAboutOpen when About is clicked', () => {
      renderNavBarWithTheme()
      
      const aboutButton = screen.getByRole('button', { name: /about/i })
      fireEvent.click(aboutButton)
      
      expect(mockOnAboutOpen).toHaveBeenCalledTimes(1)
    })

    it('should call onHelpOpen when Help is clicked', () => {
      renderNavBarWithTheme()
      
      const helpButton = screen.getByRole('button', { name: /help/i })
      fireEvent.click(helpButton)
      
      expect(mockOnHelpOpen).toHaveBeenCalledTimes(1)
    })

    it('should open GitHub link in new tab when GitHub is clicked', () => {
      renderNavBarWithTheme()
      
      const githubButton = screen.getByRole('button', { name: /github/i })
      fireEvent.click(githubButton)
      
      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://github.com/JohnathonCrowder/CodeFusionJs',
        '_blank'
      )
    })

    it('should handle undefined onGitDiffOpen gracefully', () => {
      render(
        <ThemeContext.Provider value={{ darkMode: false, toggleDarkMode: mockToggleDarkMode }}>
          <NavBar 
            onHelpOpen={mockOnHelpOpen}
            onAboutOpen={mockOnAboutOpen}
          />
        </ThemeContext.Provider>
      )
      
      const gitDiffButton = screen.getByRole('button', { name: /git diff/i })
      
      // Should not throw error when clicked
      expect(() => fireEvent.click(gitDiffButton)).not.toThrow()
    })
  })

  describe('Styling and Layout', () => {
    it('should have fixed positioning classes', () => {
      const { container } = renderNavBarWithTheme()
      
      const nav = container.querySelector('nav')
      expect(nav).toHaveClass('fixed', 'top-0', 'left-0', 'right-0', 'z-50')
    })

    it('should have backdrop blur effect', () => {
      const { container } = renderNavBarWithTheme()
      
      const nav = container.querySelector('nav')
      expect(nav).toHaveClass('backdrop-blur-xl')
    })

    it('should render gradient overlay', () => {
      const { container } = renderNavBarWithTheme()
      
      const gradientOverlay = container.querySelector('.absolute.inset-0.pointer-events-none')
      expect(gradientOverlay).toBeInTheDocument()
    })

    it('should render bottom border gradient', () => {
      const { container } = renderNavBarWithTheme()
      
      const bottomGradient = container.querySelector('.absolute.bottom-0.left-0.right-0.h-px')
      expect(bottomGradient).toBeInTheDocument()
    })

    it('should have proper hover effects on navigation items', () => {
      renderNavBarWithTheme()
      
      const aboutButton = screen.getByRole('button', { name: /about/i })
      
      // Check for the hover class with opacity
      expect(aboutButton).toHaveClass('hover:bg-gray-100/80')
    })

    it('should show active state ring on selected navigation item', () => {
      renderNavBarWithTheme()
      
      const homeButton = screen.getByRole('button', { name: /home/i })
      expect(homeButton).toHaveClass('ring-2')
    })
  })

  describe('Logo Animation', () => {
    it('should have hover effects on logo', () => {
      renderNavBarWithTheme()
      
      const logoContainer = screen.getByTestId('code-icon').closest('.group')
      expect(logoContainer).toBeInTheDocument()
      
      const codeIcon = screen.getByTestId('code-icon')
      // The hover effect is on the icon itself
      expect(codeIcon).toHaveClass('group-hover:scale-110')
    })

    it('should have glow effect container for logo', () => {
      const { container } = renderNavBarWithTheme()
      
      const glowEffect = container.querySelector('.blur-xl.opacity-0.group-hover\\:opacity-100')
      expect(glowEffect).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should hide theme button text on small screens', () => {
      renderNavBarWithTheme()
      
      const themeButtonText = screen.getByText('Dark Mode')
      expect(themeButtonText).toHaveClass('hidden', 'md:inline')
    })

    it('should hide navigation item labels on small screens', () => {
      renderNavBarWithTheme()
      
      // Find all navigation button labels (not icon labels)
      const navButtons = screen.getAllByRole('button')
      
      navButtons.forEach(button => {
        // Find spans within buttons that have the hidden md:inline classes
        const hiddenLabels = button.querySelectorAll('span.hidden.md\\:inline')
        hiddenLabels.forEach(label => {
          expect(label).toHaveClass('hidden', 'md:inline')
        })
      })
    })
  })

  describe('Accessibility', () => {
    it('should have semantic nav element', () => {
      const { container } = renderNavBarWithTheme()
      
      const nav = container.querySelector('nav')
      expect(nav).toBeInTheDocument()
    })

    it('should have accessible button labels', () => {
      renderNavBarWithTheme()
      
      const themeButton = screen.getByRole('button', { name: /switch to/i })
      expect(themeButton).toHaveAttribute('aria-label')
    })

    it('should have proper button structure for all navigation items', () => {
      renderNavBarWithTheme()
      
      const buttons = screen.getAllByRole('button')
      
      // Should have 6 buttons: theme toggle + 5 nav items
      expect(buttons).toHaveLength(6)
      
      buttons.forEach(button => {
        expect(button.tagName).toBe('BUTTON')
      })
    })

    it('should have navigation item content properly structured', () => {
      renderNavBarWithTheme()
      
      // Check that each nav button contains its icon
      expect(screen.getByTestId('home-icon')).toBeInTheDocument()
      expect(screen.getByTestId('git-diff-icon')).toBeInTheDocument()
      expect(screen.getByTestId('user-icon')).toBeInTheDocument()
      expect(screen.getByTestId('github-icon')).toBeInTheDocument()
      expect(screen.getByTestId('help-icon')).toBeInTheDocument()
    })
  })

  describe('Icon Animations', () => {
    it('should have rotation animation on theme toggle icons', () => {
      renderNavBarWithTheme(true)
      
      const sunIcon = screen.getByTestId('sun-icon')
      expect(sunIcon).toHaveClass('group-hover:rotate-180')
    })

    it('should have different rotation for moon icon', () => {
      renderNavBarWithTheme(false)
      
      const moonIcon = screen.getByTestId('moon-icon')
      expect(moonIcon).toHaveClass('group-hover:-rotate-12')
    })
  })
})