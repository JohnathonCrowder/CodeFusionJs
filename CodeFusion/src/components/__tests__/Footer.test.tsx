// src/components/__tests__/Footer.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeContext } from '../../context/ThemeContext'
import Footer from '../Footer'

// Mock the react-icons to avoid any import issues during testing
// Update the mock to include className prop
vi.mock('react-icons/fa', () => ({
  FaHeart: ({ className }: { className?: string }) => (
    <span data-testid="heart-icon" className={className}>❤️</span>
  ),
  FaGithub: ({ className }: { className?: string }) => (
    <span data-testid="github-icon" className={className}>GitHub Icon</span>
  ),
  FaExternalLinkAlt: ({ className }: { className?: string }) => (
    <span data-testid="external-link-icon" className={className}>↗</span>
  ),
}))

// Helper function to render Footer with theme context
const renderFooterWithTheme = (darkMode = false) => {
  return render(
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode: vi.fn() }}>
      <Footer />
    </ThemeContext.Provider>
  )
}

describe('Footer Component', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderFooterWithTheme()
      expect(screen.getByText(/© 2024 CodeFusion. All rights reserved./)).toBeInTheDocument()
    })

    it('should render all required links', () => {
      renderFooterWithTheme()
      
      // Check for all links
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
      expect(screen.getByText('Terms of Service')).toBeInTheDocument()
      expect(screen.getByText('Contact')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
    })

    it('should render developer credit section', () => {
      renderFooterWithTheme()
      
      expect(screen.getByText('Developed with')).toBeInTheDocument()
      expect(screen.getByText('by the CodeFusion Team')).toBeInTheDocument()
      expect(screen.getByTestId('heart-icon')).toBeInTheDocument()
    })

    it('should render the tagline', () => {
      renderFooterWithTheme()
      
      expect(screen.getByText('Empowering developers with better code management tools')).toBeInTheDocument()
    })
  })

  describe('Links', () => {
    it('should have correct href attributes for all links', () => {
      renderFooterWithTheme()
      
      const privacyLink = screen.getByText('Privacy Policy').closest('a')
      const termsLink = screen.getByText('Terms of Service').closest('a')
      const contactLink = screen.getByText('Contact').closest('a')
      const githubLink = screen.getByRole('link', { name: /github/i })
      
      expect(privacyLink).toHaveAttribute('href', 'https://github.com/JohnathonCrowder/CodeFusionJs/blob/main/CodeFusion/PRIVACY_POLICY.md')
      expect(termsLink).toHaveAttribute('href', 'https://github.com/JohnathonCrowder/CodeFusionJs/blob/main/CodeFusion/TERMS_OF_SERVICE.md')
      expect(contactLink).toHaveAttribute('href', 'https://www.johnathoncrowder.com/')
      expect(githubLink).toHaveAttribute('href', 'https://github.com/JohnathonCrowder/CodeFusionJs')
    })

    it('should open links in new tab with security attributes', () => {
      renderFooterWithTheme()
      
      const links = screen.getAllByRole('link')
      
      links.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })

    it('should display external link icons for all links', () => {
      renderFooterWithTheme()
      
      const externalIcons = screen.getAllByTestId('external-link-icon')
      expect(externalIcons).toHaveLength(3) // Privacy, Terms, Contact (GitHub has its own icon)
    })
  })

  describe('Theme Support', () => {
    it('should apply dark theme classes when darkMode is true', () => {
      const { container } = renderFooterWithTheme(true)
      
      const footer = container.querySelector('footer')
      expect(footer).toHaveClass('bg-dark-800', 'border-dark-600')
    })

    it('should apply light theme classes when darkMode is false', () => {
      const { container } = renderFooterWithTheme(false)
      
      const footer = container.querySelector('footer')
      expect(footer).toHaveClass('bg-gray-50', 'border-gray-200')
    })

    it('should have proper text colors in dark mode', () => {
      renderFooterWithTheme(true)
      
      const mainText = screen.getByText(/© 2024 CodeFusion. All rights reserved./)
      expect(mainText).toHaveClass('text-dark-100')
    })

    it('should have proper text colors in light mode', () => {
      renderFooterWithTheme(false)
      
      const mainText = screen.getByText(/© 2024 CodeFusion. All rights reserved./)
      expect(mainText).toHaveClass('text-gray-800')
    })
  })

  describe('Styling and Layout', () => {
    it('should have proper spacing and layout classes', () => {
      const { container } = renderFooterWithTheme()
      
      const footer = container.querySelector('footer')
      expect(footer).toHaveClass('relative', 'p-6', 'text-center')
    })

    it('should have transition classes for smooth theme switching', () => {
      const { container } = renderFooterWithTheme()
      
      const footer = container.querySelector('footer')
      expect(footer).toHaveClass('transition-colors', 'duration-300')
    })

    it('should have proper flex layout for links section', () => {
      renderFooterWithTheme()
      
      const linksContainer = screen.getByText('Privacy Policy').closest('div')
      expect(linksContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row')
    })

    it('should render gradient border at the top', () => {
      const { container } = renderFooterWithTheme()
      
      const gradientBorder = container.querySelector('.absolute.top-0.left-0.w-full')
      expect(gradientBorder).toBeInTheDocument()
      expect(gradientBorder).toHaveClass('h-[2px]')
    })
  })

  describe('Icons', () => {
    it('should render heart icon with proper colors in dark mode', () => {
      renderFooterWithTheme(true)
      
      const heartIcon = screen.getByTestId('heart-icon')
      expect(heartIcon).toHaveClass('text-red-400')
    })

    it('should render heart icon with proper colors in light mode', () => {
      renderFooterWithTheme(false)
      
      const heartIcon = screen.getByTestId('heart-icon')
      expect(heartIcon).toHaveClass('text-red-500')
    })

    it('should render GitHub icon', () => {
      renderFooterWithTheme()
      
      expect(screen.getByTestId('github-icon')).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive classes for mobile layout', () => {
      renderFooterWithTheme()
      
      const linksContainer = screen.getByText('Privacy Policy').closest('div')
      expect(linksContainer).toHaveClass('space-y-2', 'sm:space-y-0', 'sm:space-x-8')
    })
  })

  describe('Accessibility', () => {
    it('should have semantic footer element', () => {
      const { container } = renderFooterWithTheme()
      
      const footer = container.querySelector('footer')
      expect(footer).toBeInTheDocument()
    })

    it('should have accessible link text', () => {
      renderFooterWithTheme()
      
      const privacyLink = screen.getByText('Privacy Policy')
      const termsLink = screen.getByText('Terms of Service')
      const contactLink = screen.getByText('Contact')
      const githubLink = screen.getByRole('link', { name: /github/i })
      
      expect(privacyLink).toBeVisible()
      expect(termsLink).toBeVisible()
      expect(contactLink).toBeVisible()
      expect(githubLink).toBeVisible()
    })

    it('should have proper link structure', () => {
      renderFooterWithTheme()
      
      // Check that each link has both icon and text
      const privacyLink = screen.getByRole('link', { name: /privacy policy/i })
      const termsLink = screen.getByRole('link', { name: /terms of service/i })
      const contactLink = screen.getByRole('link', { name: /contact/i })
      
      // Each external link should contain the external icon
      expect(privacyLink.querySelector('[data-testid="external-link-icon"]')).toBeInTheDocument()
      expect(termsLink.querySelector('[data-testid="external-link-icon"]')).toBeInTheDocument()
      expect(contactLink.querySelector('[data-testid="external-link-icon"]')).toBeInTheDocument()
    })
  })

  describe('Content', () => {
    it('should display copyright year', () => {
      renderFooterWithTheme()
      
      expect(screen.getByText(/© 2024 CodeFusion/)).toBeInTheDocument()
    })

    it('should have all expected sections', () => {
      const { container } = renderFooterWithTheme()
      
      // Main sections
      const maxWidthContainer = container.querySelector('.max-w-6xl')
      const copyrightSection = container.querySelector('.mb-4')
      const linksSection = container.querySelector('.flex.flex-col.sm\\:flex-row')
      const creditSection = container.querySelector('.flex.items-center.justify-center.space-x-2')
      const taglineSection = container.querySelector('.mt-3.text-xs')
      
      expect(maxWidthContainer).toBeInTheDocument()
      expect(copyrightSection).toBeInTheDocument()
      expect(linksSection).toBeInTheDocument()
      expect(creditSection).toBeInTheDocument()
      expect(taglineSection).toBeInTheDocument()
    })
  })
})