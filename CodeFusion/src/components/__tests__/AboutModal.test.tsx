import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeContext } from '../../context/ThemeContext'
import AboutModal from '../modals/app/AboutModal'

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaTimes: ({ className }: { className?: string }) => (
    <span data-testid="times-icon" className={className}>TimesIcon</span>
  ),
  FaGithub: ({ className }: { className?: string }) => (
    <span data-testid="github-icon" className={className}>GitHubIcon</span>
  ),
  FaCode: ({ className }: { className?: string }) => (
    <span data-testid="code-icon" className={className}>CodeIcon</span>
  ),
  FaExternalLinkAlt: ({ className }: { className?: string }) => (
    <span data-testid="external-link-icon" className={className}>ExternalLinkIcon</span>
  ),
  FaGlobe: ({ className }: { className?: string }) => (
    <span data-testid="globe-icon" className={className}>GlobeIcon</span>
  ),
}))

describe('AboutModal Component', () => {
  const mockOnClose = vi.fn()

  // Helper function to render AboutModal with theme context
  const renderAboutModalWithTheme = (darkMode = false) => {
    return render(
      <ThemeContext.Provider value={{ darkMode, toggleDarkMode: vi.fn() }}>
        <AboutModal onClose={mockOnClose} />
      </ThemeContext.Provider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderAboutModalWithTheme()
      expect(screen.getByText('About CodeFusion')).toBeInTheDocument()
    })

    it('should display version information', () => {
      renderAboutModalWithTheme()
      expect(screen.getByText('Version 1.0.0')).toBeInTheDocument()
    })

    it('should display project description', () => {
      renderAboutModalWithTheme()
      expect(screen.getByText(/CodeFusion is a file management and analysis tool/)).toBeInTheDocument()
      expect(screen.getByText(/organize, review, and share code/)).toBeInTheDocument()
      expect(screen.getByText(/processing everything locally in your browser/)).toBeInTheDocument()
    })

    it('should display key features section', () => {
      renderAboutModalWithTheme()
      
      expect(screen.getByText('Key Features')).toBeInTheDocument()
      expect(screen.getByText(/Upload and organize multiple files/)).toBeInTheDocument()
      expect(screen.getByText(/Code analysis with quality metrics/)).toBeInTheDocument()
      expect(screen.getByText(/Privacy protection with anonymization/)).toBeInTheDocument()
      expect(screen.getByText(/Dark\/light theme support/)).toBeInTheDocument()
      expect(screen.getByText(/Completely client-side/)).toBeInTheDocument()
    })

    it('should display all icons', () => {
      renderAboutModalWithTheme()
      
      expect(screen.getByTestId('code-icon')).toBeInTheDocument()
      expect(screen.getByTestId('times-icon')).toBeInTheDocument()
      expect(screen.getByTestId('github-icon')).toBeInTheDocument()
      expect(screen.getByTestId('globe-icon')).toBeInTheDocument()
      
      // External link icons (multiple instances)
      const externalIcons = screen.getAllByTestId('external-link-icon')
      expect(externalIcons.length).toBeGreaterThan(0)
    })

    it('should display copyright and license information', () => {
      renderAboutModalWithTheme()
      
      expect(screen.getByText(/© 2024 CodeFusion/)).toBeInTheDocument()
      expect(screen.getByText(/Released under the MIT License/)).toBeInTheDocument()
      expect(screen.getByText('Created by Johnathon Crowder')).toBeInTheDocument()
    })

    it('should display close button in footer', () => {
      renderAboutModalWithTheme()
      
      const closeButton = screen.getByRole('button', { name: /close/i })
      expect(closeButton).toBeInTheDocument()
    })
  })

  describe('Theme Support', () => {
    it('should apply dark theme classes', () => {
      renderAboutModalWithTheme(true)
      
      const modal = screen.getByText('About CodeFusion').closest('div.relative')
      expect(modal).toHaveClass('bg-dark-800', 'border-dark-600')
    })

    it('should apply light theme classes', () => {
      renderAboutModalWithTheme(false)
      
      const modal = screen.getByText('About CodeFusion').closest('div.relative')
      expect(modal).toHaveClass('bg-white', 'border-gray-200')
    })

    it('should apply theme-specific text colors', () => {
      renderAboutModalWithTheme(true)
      
      const title = screen.getByText('About CodeFusion')
      expect(title).toHaveClass('text-dark-50')
      
      const version = screen.getByText('Version 1.0.0')
      expect(version).toHaveClass('text-dark-400')
    })

    it('should apply theme-specific colors to feature list', () => {
      renderAboutModalWithTheme(true)
      
      // The feature list container (ul) has the text color
      const featuresList = screen.getByText(/Upload and organize/).closest('ul')
      expect(featuresList).toHaveClass('text-dark-300')
    })

    it('should apply theme-specific colors to links', () => {
      renderAboutModalWithTheme(true)
      
      const githubLink = screen.getByText('View Source Code')
      expect(githubLink).toHaveClass('text-dark-200')
    })
  })

  describe('Links', () => {
    it('should render GitHub link with correct attributes', () => {
      renderAboutModalWithTheme()
      
      const githubLink = screen.getByText('View Source Code').closest('a')
      expect(githubLink).toHaveAttribute('href', 'https://github.com/JohnathonCrowder/CodeFusionJs')
      expect(githubLink).toHaveAttribute('target', '_blank')
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('should render developer website link with correct attributes', () => {
      renderAboutModalWithTheme()
      
      const developerLink = screen.getByText('Developer Website').closest('a')
      expect(developerLink).toHaveAttribute('href', 'https://www.johnathoncrowder.com/')
      expect(developerLink).toHaveAttribute('target', '_blank')
      expect(developerLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('should display external link icons for both links', () => {
      renderAboutModalWithTheme()
      
      const githubLink = screen.getByText('View Source Code').closest('a')
      const developerLink = screen.getByText('Developer Website').closest('a')
      
      const githubIcon = githubLink?.querySelector('[data-testid="external-link-icon"]')
      const developerIcon = developerLink?.querySelector('[data-testid="external-link-icon"]')
      
      expect(githubIcon).toBeInTheDocument()
      expect(developerIcon).toBeInTheDocument()
    })

    it('should have hover effect classes on links', () => {
      renderAboutModalWithTheme()
      
      const githubLink = screen.getByText('View Source Code').closest('a')
      expect(githubLink).toHaveClass('hover:scale-[1.02]')
    })
  })

  describe('Modal Actions', () => {
    it('should call onClose when close button (X) is clicked', () => {
      renderAboutModalWithTheme()
      
      const closeIcon = screen.getByTestId('times-icon').closest('button')
      fireEvent.click(closeIcon!)
      
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should call onClose when Close button in footer is clicked', () => {
      renderAboutModalWithTheme()
      
      const closeButton = screen.getByRole('button', { name: /close/i })
      fireEvent.click(closeButton)
      
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Modal Structure', () => {
    it('should have proper modal overlay structure', () => {
      renderAboutModalWithTheme()
      
      const overlay = document.querySelector('.fixed.inset-0.z-50')
      expect(overlay).toBeInTheDocument()
      expect(overlay).toHaveClass('bg-black/50', 'backdrop-blur-sm')
    })

    it('should center modal content', () => {
      renderAboutModalWithTheme()
      
      const modalContainer = document.querySelector('.flex.min-h-screen')
      expect(modalContainer).toHaveClass('items-center', 'justify-center')
    })

    it('should have proper modal width constraints', () => {
      renderAboutModalWithTheme()
      
      const modalContent = screen.getByText('About CodeFusion').closest('div.relative')
      expect(modalContent).toHaveClass('max-w-lg', 'w-full')
    })

    it('should have proper section structure', () => {
      renderAboutModalWithTheme()
      
      // Header section - find the header section wrapper with p-6 border-b
      const headerSection = document.querySelector('div.p-6.border-b')
      expect(headerSection).toBeInTheDocument()
      
      // Content section - contains key features
      const contentSection = document.querySelector('div.p-6.space-y-6')
      expect(contentSection).toBeInTheDocument()
      
      // Footer section - contains close button
      const footer = screen.getByRole('button', { name: /close/i }).closest('div.p-6')
      expect(footer).toHaveClass('border-t')
    })
  })

  describe('Styling', () => {
    it('should have rounded corners and shadow', () => {
      renderAboutModalWithTheme()
      
      const modal = screen.getByText('About CodeFusion').closest('div.relative')
      expect(modal).toHaveClass('rounded-xl', 'shadow-2xl')
    })

    it('should have proper spacing between sections', () => {
      renderAboutModalWithTheme()
      
      const contentSection = screen.getByText('Key Features').closest('div')?.parentElement
      expect(contentSection).toHaveClass('space-y-6')
    })

    it('should have transition effects', () => {
      renderAboutModalWithTheme()
      
      const modal = screen.getByText('About CodeFusion').closest('div.relative')
      expect(modal).toHaveClass('transition-colors', 'duration-300')
    })

    it('should style the description box correctly', () => {
      renderAboutModalWithTheme(true)
      
      const descriptionBox = screen.getByText(/CodeFusion is a file management/).closest('div')
      expect(descriptionBox).toHaveClass('p-5', 'rounded-lg', 'border')
    })

    it('should style feature list with bullets', () => {
      renderAboutModalWithTheme()
      
      const featureList = screen.getByText(/Upload and organize/).parentElement
      const features = featureList?.querySelectorAll('li')
      
      features?.forEach(feature => {
        expect(feature.textContent).toMatch(/^•/)
      })
    })
  })

  describe('Content', () => {
    it('should list all five key features', () => {
      renderAboutModalWithTheme()
      
      const features = [
        'Upload and organize multiple files or directories',
        'Code analysis with quality metrics',
        'Privacy protection with anonymization options',
        'Dark/light theme support',
        'Completely client-side - no data sent to servers'
      ]
      
      features.forEach(feature => {
        expect(screen.getByText(new RegExp(feature))).toBeInTheDocument()
      })
    })

    it('should emphasize privacy aspect', () => {
      renderAboutModalWithTheme()
      
      // Check that privacy is mentioned in description
      expect(screen.getByText(/maintaining privacy/)).toBeInTheDocument()
      expect(screen.getByText(/processing everything locally/)).toBeInTheDocument()
    })

    it('should display section icons correctly', () => {
      renderAboutModalWithTheme()
      
      // Check for section icons
      const codeIcon = screen.getByTestId('code-icon')
      expect(codeIcon.closest('div')).toHaveClass('p-2', 'rounded-lg')
    })
  })

  describe('Accessibility', () => {
    it('should have accessible modal structure', () => {
      renderAboutModalWithTheme()
      
      const modal = document.querySelector('[class*="fixed inset-0"]')
      expect(modal).toBeInTheDocument()
    })

    it('should have accessible headings', () => {
      renderAboutModalWithTheme()
      
      const mainHeading = screen.getByRole('heading', { name: /about codefusion/i })
      expect(mainHeading).toBeInTheDocument()
      expect(mainHeading.tagName).toBe('H2')
      
      const featuresHeading = screen.getByRole('heading', { name: /key features/i })
      expect(featuresHeading).toBeInTheDocument()
      expect(featuresHeading.tagName).toBe('H3')
    })

    it('should have accessible links', () => {
      renderAboutModalWithTheme()
      
      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(2) // GitHub and Developer Website
      
      links.forEach(link => {
        expect(link).toHaveAttribute('href')
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })

    it('should have accessible buttons', () => {
      renderAboutModalWithTheme()
      
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2) // X icon and Close button
      
      buttons.forEach(button => {
        expect(button).toBeVisible()
      })
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive padding', () => {
      renderAboutModalWithTheme()
      
      const modalWrapper = document.querySelector('.flex.min-h-screen')
      expect(modalWrapper).toHaveClass('px-4')
    })

    it('should constrain modal width appropriately', () => {
      renderAboutModalWithTheme()
      
      const modal = screen.getByText('About CodeFusion').closest('div.relative')
      expect(modal).toHaveClass('max-w-lg', 'w-full')
    })
  })
})