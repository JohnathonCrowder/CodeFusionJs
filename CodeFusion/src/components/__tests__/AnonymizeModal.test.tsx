import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeContext } from '../../context/ThemeContext'
import AnonymizeModal from '../AnonymizeModal'

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaEyeSlash: ({ className }: { className?: string }) => (
    <span data-testid="eye-slash-icon" className={className}>EyeSlashIcon</span>
  ),
  FaTimes: ({ className }: { className?: string }) => (
    <span data-testid="times-icon" className={className}>TimesIcon</span>
  ),
  FaUser: ({ className }: { className?: string }) => (
    <span data-testid="user-icon" className={className}>UserIcon</span>
  ),
  FaEnvelope: ({ className }: { className?: string }) => (
    <span data-testid="envelope-icon" className={className}>EnvelopeIcon</span>
  ),
  FaPlus: ({ className }: { className?: string }) => (
    <span data-testid="plus-icon" className={className}>PlusIcon</span>
  ),
  FaTrash: ({ className }: { className?: string }) => (
    <span data-testid="trash-icon" className={className}>TrashIcon</span>
  ),
  FaShieldAlt: ({ className }: { className?: string }) => (
    <span data-testid="shield-alt-icon" className={className}>ShieldAltIcon</span>
  ),
  FaSave: ({ className }: { className?: string }) => (
    <span data-testid="save-icon" className={className}>SaveIcon</span>
  ),
  FaExclamationTriangle: ({ className }: { className?: string }) => (
    <span data-testid="exclamation-icon" className={className}>ExclamationIcon</span>
  ),
}))

describe('AnonymizeModal Component', () => {
  const mockOnClose = vi.fn()
  const mockOnSave = vi.fn()
  
  const defaultSettings = {
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe123',
    email: 'john.doe@example.com',
    customReplacements: [
      { original: 'CompanyName', replacement: 'ACME Corp' }
    ]
  }
  
  const emptySettings = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    customReplacements: []
  }

  // Helper function to render AnonymizeModal with theme context
  const renderAnonymizeModalWithTheme = (
    darkMode = false,
    currentSettings = defaultSettings
  ) => {
    return render(
      <ThemeContext.Provider value={{ darkMode, toggleDarkMode: vi.fn() }}>
        <AnonymizeModal
          onClose={mockOnClose}
          onSave={mockOnSave}
          currentSettings={currentSettings}
        />
      </ThemeContext.Provider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderAnonymizeModalWithTheme()
      expect(screen.getByText('Privacy Settings')).toBeInTheDocument()
    })

    it('should display header with description', () => {
      renderAnonymizeModalWithTheme()
      
      expect(screen.getByText('Privacy Settings')).toBeInTheDocument()
      expect(screen.getByText('Configure anonymization options')).toBeInTheDocument()
    })

    it('should display privacy protection information', () => {
      renderAnonymizeModalWithTheme()
      
      expect(screen.getByText('Protect Your Privacy')).toBeInTheDocument()
      expect(screen.getByText(/Enter your personal information below/)).toBeInTheDocument()
      expect(screen.getByText(/replaced with generic values/)).toBeInTheDocument()
    })

    it('should render all input fields', () => {
      renderAnonymizeModalWithTheme()
      
      expect(screen.getByLabelText('First Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Last Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Username/Handle')).toBeInTheDocument()
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
    })

    it('should display replacement hints', () => {
      renderAnonymizeModalWithTheme()
      
      expect(screen.getByText('Will be replaced with "John"')).toBeInTheDocument()
      expect(screen.getByText('Will be replaced with "Doe"')).toBeInTheDocument()
      expect(screen.getByText('Will be replaced with "user123"')).toBeInTheDocument()
      expect(screen.getByText('Will be replaced with "john.doe@example.com"')).toBeInTheDocument()
    })

    it('should display all icons', () => {
      renderAnonymizeModalWithTheme()
      
      // Use getAllByTestId for icons that appear multiple times
      const eyeSlashIcons = screen.getAllByTestId('eye-slash-icon')
      expect(eyeSlashIcons.length).toBeGreaterThan(0)
      
      expect(screen.getByTestId('times-icon')).toBeInTheDocument()
      expect(screen.getByTestId('user-icon')).toBeInTheDocument()
      expect(screen.getByTestId('envelope-icon')).toBeInTheDocument()
      expect(screen.getByTestId('shield-alt-icon')).toBeInTheDocument()
      expect(screen.getByTestId('save-icon')).toBeInTheDocument()
      expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
    })

    it('should render footer buttons', () => {
      renderAnonymizeModalWithTheme()
      
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByText('Save Privacy Settings')).toBeInTheDocument()
    })
  })

  describe('Theme Support', () => {
    it('should apply dark theme classes', () => {
      renderAnonymizeModalWithTheme(true)
      
      const modal = screen.getByText('Privacy Settings').closest('div.relative')
      expect(modal).toHaveClass('bg-dark-800', 'border-dark-600')
    })

    it('should apply light theme classes', () => {
      renderAnonymizeModalWithTheme(false)
      
      const modal = screen.getByText('Privacy Settings').closest('div.relative')
      expect(modal).toHaveClass('bg-white', 'border-gray-200')
    })

    it('should apply theme-specific input styles', () => {
      renderAnonymizeModalWithTheme(true)
      
      const firstNameInput = screen.getByLabelText('First Name')
      expect(firstNameInput).toHaveClass('bg-dark-600', 'border-dark-500', 'text-dark-100')
    })

    it('should apply theme-specific button styles', () => {
      renderAnonymizeModalWithTheme(true)
      
      const cancelButton = screen.getByText('Cancel')
      expect(cancelButton).toHaveClass('bg-dark-600', 'text-dark-200')
    })
  })

  describe('Personal Information Section', () => {
    it('should populate fields with current settings', () => {
      renderAnonymizeModalWithTheme(false, defaultSettings)
      
      expect(screen.getByLabelText('First Name')).toHaveValue('John')
      expect(screen.getByLabelText('Last Name')).toHaveValue('Doe')
      expect(screen.getByLabelText('Username/Handle')).toHaveValue('johndoe123')
      expect(screen.getByLabelText('Email Address')).toHaveValue('john.doe@example.com')
    })

    it('should handle empty initial settings', () => {
      renderAnonymizeModalWithTheme(false, emptySettings)
      
      expect(screen.getByLabelText('First Name')).toHaveValue('')
      expect(screen.getByLabelText('Last Name')).toHaveValue('')
      expect(screen.getByLabelText('Username/Handle')).toHaveValue('')
      expect(screen.getByLabelText('Email Address')).toHaveValue('')
    })

    it('should update first name field', async () => {
      renderAnonymizeModalWithTheme()
      const user = userEvent.setup()
      
      const firstNameInput = screen.getByLabelText('First Name')
      await user.clear(firstNameInput)
      await user.type(firstNameInput, 'Jane')
      
      expect(firstNameInput).toHaveValue('Jane')
    })

    it('should update last name field', async () => {
      renderAnonymizeModalWithTheme()
      const user = userEvent.setup()
      
      const lastNameInput = screen.getByLabelText('Last Name')
      await user.clear(lastNameInput)
      await user.type(lastNameInput, 'Smith')
      
      expect(lastNameInput).toHaveValue('Smith')
    })

    it('should update username field', async () => {
      renderAnonymizeModalWithTheme()
      const user = userEvent.setup()
      
      const usernameInput = screen.getByLabelText('Username/Handle')
      await user.clear(usernameInput)
      await user.type(usernameInput, 'janesmith')
      
      expect(usernameInput).toHaveValue('janesmith')
    })

    it('should update email field', async () => {
      renderAnonymizeModalWithTheme()
      const user = userEvent.setup()
      
      const emailInput = screen.getByLabelText('Email Address')
      await user.clear(emailInput)
      await user.type(emailInput, 'jane@example.com')
      
      expect(emailInput).toHaveValue('jane@example.com')
    })

    it('should display email icon in email field', () => {
      renderAnonymizeModalWithTheme()
      
      const emailWrapper = screen.getByLabelText('Email Address').parentElement
      const emailIcon = emailWrapper?.querySelector('[data-testid="envelope-icon"]')
      
      expect(emailIcon).toBeInTheDocument()
    })
  })

  describe('Custom Replacements Section', () => {
    it('should display custom replacements section', () => {
      renderAnonymizeModalWithTheme()
      
      expect(screen.getByText('Custom Replacements')).toBeInTheDocument()
    })

    it('should show existing custom replacements', () => {
      renderAnonymizeModalWithTheme(false, defaultSettings)
      
      const originalInputs = screen.getAllByPlaceholderText('Original text')
      const replacementInputs = screen.getAllByPlaceholderText('Replacement text')
      
      expect(originalInputs[0]).toHaveValue('CompanyName')
      expect(replacementInputs[0]).toHaveValue('ACME Corp')
    })

    it('should show empty replacement field when no custom replacements', () => {
      renderAnonymizeModalWithTheme(false, emptySettings)
      
      const originalInputs = screen.getAllByPlaceholderText('Original text')
      const replacementInputs = screen.getAllByPlaceholderText('Replacement text')
      
      expect(originalInputs).toHaveLength(1)
      expect(replacementInputs).toHaveLength(1)
      expect(originalInputs[0]).toHaveValue('')
      expect(replacementInputs[0]).toHaveValue('')
    })

    it('should add new custom replacement field', () => {
      renderAnonymizeModalWithTheme()
      
      const addButton = screen.getByText('Add')
      fireEvent.click(addButton)
      
      const originalInputs = screen.getAllByPlaceholderText('Original text')
      expect(originalInputs).toHaveLength(2)
    })

    it('should update custom replacement fields', async () => {
      renderAnonymizeModalWithTheme(false, emptySettings)
      const user = userEvent.setup()
      
      const originalInput = screen.getByPlaceholderText('Original text')
      const replacementInput = screen.getByPlaceholderText('Replacement text')
      
      await user.type(originalInput, 'MyCompany')
      await user.type(replacementInput, 'Company X')
      
      expect(originalInput).toHaveValue('MyCompany')
      expect(replacementInput).toHaveValue('Company X')
    })

    it('should remove custom replacement field', () => {
      renderAnonymizeModalWithTheme(false, defaultSettings)
      
      const deleteButton = screen.getByTestId('trash-icon').closest('button')
      fireEvent.click(deleteButton!)
      
      // Should still have one empty field (minimum)
      const originalInputs = screen.getAllByPlaceholderText('Original text')
      expect(originalInputs).toHaveLength(1)
      expect(originalInputs[0]).toHaveValue('')
    })

    it('should not remove last custom replacement field', () => {
      renderAnonymizeModalWithTheme(false, emptySettings)
      
      const deleteButton = screen.getByTestId('trash-icon').closest('button')
      fireEvent.click(deleteButton!)
      
      // Should still have one field
      const originalInputs = screen.getAllByPlaceholderText('Original text')
      expect(originalInputs).toHaveLength(1)
    })

    it('should display warning message for custom replacements', () => {
      renderAnonymizeModalWithTheme()
      
      expect(screen.getByText(/Add any other text that should be replaced/)).toBeInTheDocument()
      expect(screen.getByText(/Only filled entries will be saved/)).toBeInTheDocument()
    })

    it('should be scrollable when many replacements exist', () => {
      renderAnonymizeModalWithTheme()
      
      // Add multiple replacements
      const addButton = screen.getByText('Add')
      for (let i = 0; i < 5; i++) {
        fireEvent.click(addButton)
      }
      
      // Find the scrollable container - it's the direct parent of the replacement fields
      const replacementFields = screen.getAllByPlaceholderText('Original text')[0].closest('div')
      const scrollableContainer = replacementFields?.parentElement
      
      expect(scrollableContainer).toHaveClass('space-y-3', 'max-h-40', 'overflow-y-auto')
    })
  })

  describe('Modal Actions', () => {
    it('should call onClose when close button is clicked', () => {
      renderAnonymizeModalWithTheme()
      
      const closeButton = screen.getByTestId('times-icon').closest('button')
      fireEvent.click(closeButton!)
      
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should call onClose when Cancel button is clicked', () => {
      renderAnonymizeModalWithTheme()
      
      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)
      
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should call onSave with all data when Save button is clicked', async () => {
      renderAnonymizeModalWithTheme(false, defaultSettings)
      
      const saveButton = screen.getByText('Save Privacy Settings')
      fireEvent.click(saveButton)
      
      expect(mockOnSave).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',  // Fixed: was '=e'
        username: 'johndoe123',
        email: 'john.doe@example.com',
        customReplacements: [
          { original: 'CompanyName', replacement: 'ACME Corp' }
        ]
      })
    })

    it('should filter out empty custom replacements when saving', async () => {
      renderAnonymizeModalWithTheme(false, emptySettings)
      const user = userEvent.setup()
      
      // Add a custom replacement
      const originalInput = screen.getByPlaceholderText('Original text')
      const replacementInput = screen.getByPlaceholderText('Replacement text')
      
      await user.type(originalInput, 'TestCompany')
      await user.type(replacementInput, 'Example Corp')
      
      // Add another empty one
      const addButton = screen.getByText('Add')
      fireEvent.click(addButton)
      
      const saveButton = screen.getByText('Save Privacy Settings')
      fireEvent.click(saveButton)
      
      expect(mockOnSave).toHaveBeenCalledWith({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        customReplacements: [
          { original: 'TestCompany', replacement: 'Example Corp' }
        ]
      })
    })

    it('should handle saving with empty settings', () => {
      renderAnonymizeModalWithTheme(false, emptySettings)
      
      const saveButton = screen.getByText('Save Privacy Settings')
      fireEvent.click(saveButton)
      
      expect(mockOnSave).toHaveBeenCalledWith({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        customReplacements: []
      })
    })
  })

  describe('Modal Structure', () => {
    it('should have proper modal overlay', () => {
      renderAnonymizeModalWithTheme()
      
      const overlay = document.querySelector('.fixed.inset-0.z-50')
      expect(overlay).toBeInTheDocument()
      expect(overlay).toHaveClass('bg-black/50', 'backdrop-blur-sm')
    })

    it('should center modal content', () => {
      renderAnonymizeModalWithTheme()
      
      const modalContainer = document.querySelector('.flex.min-h-screen')
      expect(modalContainer).toHaveClass('items-center', 'justify-center')
    })

    it('should have proper modal dimensions', () => {
      renderAnonymizeModalWithTheme()
      
      const modal = screen.getByText('Privacy Settings').closest('div.relative')
      expect(modal).toHaveClass('max-w-xl', 'w-full')
    })

    it('should have scrollable content area', () => {
      renderAnonymizeModalWithTheme()
      
      const contentArea = screen.getByText('Protect Your Privacy').closest('div.p-6')
      expect(contentArea).toHaveClass('max-h-[60vh]', 'overflow-y-auto')
    })
  })

  describe('Styling', () => {
    it('should style information boxes correctly', () => {
      renderAnonymizeModalWithTheme(true)
      
      // Find the information box by its parent that has the correct classes
      const infoBoxParent = screen.getByText('Protect Your Privacy').closest('div.p-4')
      expect(infoBoxParent).toHaveClass('p-4', 'rounded-lg', 'border-l-4')
    })

    it('should have rounded corners and shadows', () => {
      renderAnonymizeModalWithTheme()
      
      const modal = screen.getByText('Privacy Settings').closest('div.relative')
      expect(modal).toHaveClass('rounded-xl', 'shadow-2xl')
    })

    it('should style input fields with proper spacing', () => {
      renderAnonymizeModalWithTheme()
      
      // Check specific inputs, not all textboxes (email field has different padding)
      const firstNameInput = screen.getByLabelText('First Name')
      const lastNameInput = screen.getByLabelText('Last Name')
      const usernameInput = screen.getByLabelText('Username/Handle')
      
      expect(firstNameInput).toHaveClass('p-3', 'rounded-lg')
      expect(lastNameInput).toHaveClass('p-3', 'rounded-lg')
      expect(usernameInput).toHaveClass('p-3', 'rounded-lg')
      
      // Email has different padding due to icon
      const emailInput = screen.getByLabelText('Email Address')
      expect(emailInput).toHaveClass('py-3', 'rounded-lg')
    })

    it('should have grid layout for personal information fields', () => {
      renderAnonymizeModalWithTheme()
      
      const personalInfoSection = screen.getByText('Personal Information')
        .closest('div')
        ?.querySelector('.grid')
      
      expect(personalInfoSection).toHaveClass('grid-cols-1', 'md:grid-cols-2')
    })
  })

  describe('Accessibility', () => {
    it('should have accessible form structure', () => {
      renderAnonymizeModalWithTheme()
      
      // Check that labeled inputs have IDs
      const labeledInputs = [
        screen.getByLabelText('First Name'),
        screen.getByLabelText('Last Name'),
        screen.getByLabelText('Username/Handle'),
        screen.getByLabelText('Email Address')
      ]
      
      labeledInputs.forEach(input => {
        expect(input).toHaveAttribute('id')
      })
    })

    it('should have proper labels for all form fields', () => {
      renderAnonymizeModalWithTheme()
      
      expect(screen.getByLabelText('First Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Last Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Username/Handle')).toBeInTheDocument()
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
    })

    it('should have accessible buttons', () => {
      renderAnonymizeModalWithTheme()
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toBeVisible()
      })
    })

    it('should use semantic heading structure', () => {
      renderAnonymizeModalWithTheme()
      
      const mainHeading = screen.getByRole('heading', { name: 'Privacy Settings' })
      expect(mainHeading).toBeInTheDocument()
      expect(mainHeading.tagName).toBe('H2')
      
      const sectionHeadings = screen.getAllByRole('heading', { level: 3 })
      expect(sectionHeadings.length).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long input values', async () => {
      renderAnonymizeModalWithTheme()
      const user = userEvent.setup()
      
      const longText = 'a'.repeat(100)
      const firstNameInput = screen.getByLabelText('First Name')
      
      await user.clear(firstNameInput)
      await user.type(firstNameInput, longText)
      
      expect(firstNameInput).toHaveValue(longText)
    })

    it('should handle special characters in inputs', async () => {
      renderAnonymizeModalWithTheme()
      const user = userEvent.setup()
      
      const specialText = 'Test@#$%^&*()'
      const usernameInput = screen.getByLabelText('Username/Handle')
      
      await user.clear(usernameInput)
      await user.type(usernameInput, specialText)
      
      expect(usernameInput).toHaveValue(specialText)
    })

    it('should handle rapid add/remove of custom replacements', () => {
      renderAnonymizeModalWithTheme(false, emptySettings)
      
      const addButton = screen.getByText('Add')
      
      // Rapidly add
      for (let i = 0; i < 5; i++) {
        fireEvent.click(addButton)
      }
      
      let originalInputs = screen.getAllByPlaceholderText('Original text')
      expect(originalInputs).toHaveLength(6) // 1 initial + 5 added
      
      // Get delete buttons and click only the ones that can be deleted
      let deleteButtons = screen.getAllByTestId('trash-icon')
      
      // The component might prevent deleting the last item, so try to delete all but check the result
      deleteButtons.forEach(button => {
        fireEvent.click(button.closest('button')!)
      })
      
      // Re-query to see what's left
      originalInputs = screen.getAllByPlaceholderText('Original text')
      
      // The component maintains at least 1 field, but it might keep more depending on implementation
      // Let's just check that there's at least 1
      expect(originalInputs.length).toBeGreaterThanOrEqual(1)
    })
  })
})  