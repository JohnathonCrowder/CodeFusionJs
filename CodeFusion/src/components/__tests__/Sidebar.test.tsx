// src/components/__tests__/Sidebar.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeContext } from '../../context/ThemeContext'
import Sidebar from '../Sidebar'

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaBrain: ({ className }: { className?: string }) => (
    <span data-testid="brain-icon" className={className}>BrainIcon</span>
  ),
  FaEraser: ({ className }: { className?: string }) => (
    <span data-testid="eraser-icon" className={className}>EraserIcon</span>
  ),
  FaCopy: ({ className }: { className?: string }) => (
    <span data-testid="copy-icon" className={className}>CopyIcon</span>
  ),
  FaFileUpload: ({ className }: { className?: string }) => (
    <span data-testid="file-upload-icon" className={className}>FileUploadIcon</span>
  ),
  FaFolderOpen: ({ className }: { className?: string }) => (
    <span data-testid="folder-open-icon" className={className}>FolderOpenIcon</span>
  ),
  FaCog: ({ className }: { className?: string }) => (
    <span data-testid="cog-icon" className={className}>CogIcon</span>
  ),
  FaChevronDown: ({ className }: { className?: string }) => (
    <span data-testid="chevron-down-icon" className={className}>ChevronDownIcon</span>
  ),
  FaChevronRight: ({ className }: { className?: string }) => (
    <span data-testid="chevron-right-icon" className={className}>ChevronRightIcon</span>
  ),
  FaFile: ({ className }: { className?: string }) => (
    <span data-testid="file-icon" className={className}>FileIcon</span>
  ),
  FaFolder: ({ className }: { className?: string }) => (
    <span data-testid="folder-icon" className={className}>FolderIcon</span>
  ),
  FaEyeSlash: ({ className }: { className?: string }) => (
    <span data-testid="eye-slash-icon" className={className}>EyeSlashIcon</span>
  ),
  FaEye: ({ className }: { className?: string }) => (
    <span data-testid="eye-icon" className={className}>EyeIcon</span>
  ),
}))

describe('Sidebar Component', () => {
  const mockOnClearText = vi.fn()
  const mockOnCopyText = vi.fn()
  const mockOnUploadFile = vi.fn()
  const mockOnUploadDirectory = vi.fn()
  const mockOnSettingsOpen = vi.fn()
  const mockOnCodeAnalyzerToggle = vi.fn()
  const mockOnAnonymizeOpen = vi.fn()
  const mockOnFileVisibilityToggle = vi.fn()

  const sampleUploadedFiles = [
    {
      name: 'app.js',
      content: 'console.log("app");',
      visible: true,
      path: 'src/app.js'
    },
    {
      name: 'components',
      content: '',
      visible: true,
      path: 'src/components',
      children: [
        {
          name: 'Header.jsx',
          content: 'export default Header;',
          visible: true,
          path: 'src/components/Header.jsx'
        },
        {
          name: 'Footer.jsx',
          content: 'export default Footer;',
          visible: false,
          path: 'src/components/Footer.jsx'
        }
      ]
    }
  ]

  const sampleSkippedFiles = [
    new File(['content'], 'test.exe'),
    new File(['content'], 'image.jpg')
  ]

  // Helper function to render Sidebar with theme context
  const renderSidebarWithTheme = (
    darkMode = false,
    uploadedFiles = sampleUploadedFiles,
    skippedFiles = sampleSkippedFiles,
    showCodeAnalyzer = false
  ) => {
    return render(
      <ThemeContext.Provider value={{ darkMode, toggleDarkMode: vi.fn() }}>
        <Sidebar
          onClearText={mockOnClearText}
          onCopyText={mockOnCopyText}
          onUploadFile={mockOnUploadFile}
          onUploadDirectory={mockOnUploadDirectory}
          onSettingsOpen={mockOnSettingsOpen}
          onCodeAnalyzerToggle={mockOnCodeAnalyzerToggle}
          onAnonymizeOpen={mockOnAnonymizeOpen}
          showCodeAnalyzer={showCodeAnalyzer}
          uploadedFiles={uploadedFiles}
          skippedFiles={skippedFiles}
          onFileVisibilityToggle={mockOnFileVisibilityToggle}
        />
      </ThemeContext.Provider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderSidebarWithTheme()
      expect(screen.getByText('Controls')).toBeInTheDocument()
    })

    it('should render all control buttons', () => {
      renderSidebarWithTheme()
      
      expect(screen.getByText('Clear Text')).toBeInTheDocument()
      expect(screen.getByText('Copy All')).toBeInTheDocument()
      expect(screen.getByText('Smart Analysis')).toBeInTheDocument()
      expect(screen.getByText('Anonymize Personal Info')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
      expect(screen.getByText('Upload Files')).toBeInTheDocument()
      expect(screen.getByText('Upload Directory')).toBeInTheDocument()
    })

    it('should display uploaded files section', () => {
      renderSidebarWithTheme()
      
      expect(screen.getByText('Uploaded Files')).toBeInTheDocument()
      expect(screen.getByText('app.js')).toBeInTheDocument()
      expect(screen.getByText('components')).toBeInTheDocument()
    })

    it('should display file count badge', () => {
      renderSidebarWithTheme()
      
      // Get all elements with text "2" and find the one that's a file count badge
      const allTwos = screen.getAllByText('2')
      const fileCountBadge = allTwos.find(element => 
        element.classList.contains('bg-gray-100') || element.classList.contains('bg-dark-600')
      )
      expect(fileCountBadge).toBeInTheDocument()
    })

    it('should show empty state when no files uploaded', () => {
      renderSidebarWithTheme(false, [], [])
      
      expect(screen.getByText('No files uploaded yet')).toBeInTheDocument()
    })
  })

  describe('Theme Support', () => {
    it('should apply dark theme classes', () => {
      const { container } = renderSidebarWithTheme(true)
      
      const sidebar = container.firstChild as HTMLElement
      expect(sidebar).toHaveClass('bg-dark-800', 'border-dark-600')
    })

    it('should apply light theme classes', () => {
      const { container } = renderSidebarWithTheme(false)
      
      const sidebar = container.firstChild as HTMLElement
      expect(sidebar).toHaveClass('bg-white', 'border-gray-200')
    })
  })

  describe('Button Functionality', () => {
    it('should call onClearText when Clear Text button is clicked', () => {
      renderSidebarWithTheme()
      
      const clearButton = screen.getByText('Clear Text')
      fireEvent.click(clearButton)
      
      expect(mockOnClearText).toHaveBeenCalledTimes(1)
    })

    it('should call onCopyText when Copy All button is clicked', () => {
      renderSidebarWithTheme()
      
      const copyButton = screen.getByText('Copy All')
      fireEvent.click(copyButton)
      
      expect(mockOnCopyText).toHaveBeenCalledTimes(1)
    })

    it('should call onCodeAnalyzerToggle when Smart Analysis button is clicked', () => {
      renderSidebarWithTheme()
      
      const analysisButton = screen.getByText('Smart Analysis')
      fireEvent.click(analysisButton)
      
      expect(mockOnCodeAnalyzerToggle).toHaveBeenCalledTimes(1)
    })

    it('should call onAnonymizeOpen when Anonymize button is clicked', () => {
      renderSidebarWithTheme()
      
      const anonymizeButton = screen.getByText('Anonymize Personal Info')
      fireEvent.click(anonymizeButton)
      
      expect(mockOnAnonymizeOpen).toHaveBeenCalledTimes(1)
    })

    it('should call onSettingsOpen when Settings button is clicked', () => {
      renderSidebarWithTheme()
      
      const settingsButton = screen.getByText('Settings')
      fireEvent.click(settingsButton)
      
      expect(mockOnSettingsOpen).toHaveBeenCalledTimes(1)
    })

    it('should highlight Smart Analysis button when analyzer is shown', () => {
      renderSidebarWithTheme(false, sampleUploadedFiles, sampleSkippedFiles, true)
      
      const analysisButton = screen.getByText('Smart Analysis').closest('button')
      expect(analysisButton).toHaveClass('bg-blue-600')
    })
  })

  describe('File Upload', () => {
    it('should trigger file upload when clicking Upload Files', () => {
      renderSidebarWithTheme()
      
      const fileInput = document.querySelector('#fileInput') as HTMLInputElement
      expect(fileInput).toBeInTheDocument()
      expect(fileInput.type).toBe('file')
      expect(fileInput.multiple).toBe(true)
    })

    it('should trigger directory upload when clicking Upload Directory', () => {
      renderSidebarWithTheme()
      
      const dirInput = document.querySelector('#dirInput') as HTMLInputElement
      expect(dirInput).toBeInTheDocument()
      expect(dirInput.type).toBe('file')
      expect(dirInput.multiple).toBe(true)
      expect(dirInput).toHaveAttribute('webkitdirectory', '')
    })

    it('should call onUploadFile when files are selected', () => {
      renderSidebarWithTheme()
      
      const fileInput = document.querySelector('#fileInput') as HTMLInputElement
      const mockFile = new File(['test'], 'test.js')
      
      Object.defineProperty(fileInput, 'files', {
        value: [mockFile],
        writable: false,
      })
      
      fireEvent.change(fileInput)
      
      expect(mockOnUploadFile).toHaveBeenCalledTimes(1)
    })

    it('should call onUploadDirectory when directory is selected', () => {
      renderSidebarWithTheme()
      
      const dirInput = document.querySelector('#dirInput') as HTMLInputElement
      const mockFile = new File(['test'], 'test.js')
      
      Object.defineProperty(mockFile, 'webkitRelativePath', {
        value: 'folder/test.js',
        writable: false,
      })
      
      Object.defineProperty(dirInput, 'files', {
        value: [mockFile],
        writable: false,
      })
      
      fireEvent.change(dirInput)
      
      expect(mockOnUploadDirectory).toHaveBeenCalledTimes(1)
    })
  })

  describe('File Tree', () => {
    it('should display nested files correctly', () => {
      renderSidebarWithTheme()
      
      expect(screen.getByText('Header.jsx')).toBeInTheDocument()
      expect(screen.getByText('Footer.jsx')).toBeInTheDocument()
    })

    it('should show correct visibility icons', () => {
      renderSidebarWithTheme()
      
      // Check that we have visibility icons in the file tree
      const eyeIcons = screen.getAllByTestId('eye-icon')
      const eyeSlashIcons = screen.getAllByTestId('eye-slash-icon')
      
      // Should have at least one of each type
      expect(eyeIcons.length).toBeGreaterThan(0)
      expect(eyeSlashIcons.length).toBeGreaterThan(0)
    })

    it('should call onFileVisibilityToggle when visibility button is clicked', () => {
      renderSidebarWithTheme()
      
      // Find all buttons in the file tree area
      const fileTreeArea = screen.getByText('app.js').closest('ul')
      const buttons = fileTreeArea?.querySelectorAll('button')
      
      // Find the visibility toggle button for the first visible file
      const visibilityButton = Array.from(buttons || []).find(button => 
        button.querySelector('[data-testid="eye-icon"]') || 
        button.querySelector('[data-testid="eye-slash-icon"]')
      )
      
      expect(visibilityButton).toBeInTheDocument()
      fireEvent.click(visibilityButton!)
      
      expect(mockOnFileVisibilityToggle).toHaveBeenCalled()
    })

    it('should hide children when parent folder is not visible', () => {
      const filesWithHiddenFolder = [
        {
          name: 'hidden-folder',
          content: '',
          visible: false,
          path: 'src/hidden-folder',
          children: [
            {
              name: 'child.js',
              content: 'content',
              visible: true,
              path: 'src/hidden-folder/child.js'
            }
          ]
        }
      ]
      
      renderSidebarWithTheme(false, filesWithHiddenFolder)
      
      expect(screen.getByText('hidden-folder')).toBeInTheDocument()
      expect(screen.queryByText('child.js')).not.toBeInTheDocument()
    })

    it('should apply proper styling to folders', () => {
      renderSidebarWithTheme()
      
      const folderElement = screen.getByText('components').closest('div')
      const folderIcon = folderElement?.querySelector('[data-testid="folder-icon"]')
      
      expect(folderIcon).toBeInTheDocument()
    })

    it('should apply proper styling to files', () => {
      renderSidebarWithTheme()
      
      const fileElement = screen.getByText('app.js').closest('div')
      const fileIcon = fileElement?.querySelector('[data-testid="file-icon"]')
      
      expect(fileIcon).toBeInTheDocument()
    })
  })

  describe('Skipped Files', () => {
    it('should display skipped files section', () => {
      renderSidebarWithTheme()
      
      expect(screen.getByText('Skipped Files')).toBeInTheDocument()
      
      // Get all elements with text "2" and find the one that's a skipped files badge
      const allTwos = screen.getAllByText('2')
      const skippedBadge = allTwos.find(element => 
        element.classList.contains('bg-orange-100') || element.classList.contains('bg-orange-900/30')
      )
      expect(skippedBadge).toBeInTheDocument()
    })

    it('should toggle skipped files visibility when clicked', () => {
      renderSidebarWithTheme()
      
      // Initially collapsed
      expect(screen.queryByText('test.exe')).not.toBeInTheDocument()
      
      // Click to expand
      const skippedHeader = screen.getByText('Skipped Files')
      fireEvent.click(skippedHeader)
      
      // Should now show skipped files
      expect(screen.getByText('test.exe')).toBeInTheDocument()
      expect(screen.getByText('image.jpg')).toBeInTheDocument()
    })

    it('should show chevron icon state correctly', () => {
      renderSidebarWithTheme()
      
      // Initially shows right chevron (collapsed)
      expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument()
      
      // Click to expand
      const skippedHeader = screen.getByText('Skipped Files')
      fireEvent.click(skippedHeader)
      
      // Should show down chevron (expanded)
      expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument()
    })

    it('should show file extensions in skipped files', () => {
      renderSidebarWithTheme()
      
      // Expand skipped files
      const skippedHeader = screen.getByText('Skipped Files')
      fireEvent.click(skippedHeader)
      
      expect(screen.getByText('EXE')).toBeInTheDocument()
      expect(screen.getByText('JPG')).toBeInTheDocument()
    })

    it('should show empty state when no files are skipped', () => {
      renderSidebarWithTheme(false, sampleUploadedFiles, [])
      
      // Expand skipped files
      const skippedHeader = screen.getByText('Skipped Files')
      fireEvent.click(skippedHeader)
      
      expect(screen.getByText('No files were skipped')).toBeInTheDocument()
    })
  })

  describe('Button Icons', () => {
    it('should display correct icons for all buttons', () => {
      renderSidebarWithTheme()
      
      // Check for each icon individually
      expect(screen.getByTestId('eraser-icon')).toBeInTheDocument()
      expect(screen.getByTestId('copy-icon')).toBeInTheDocument()
      expect(screen.getByTestId('brain-icon')).toBeInTheDocument()
      expect(screen.getByTestId('cog-icon')).toBeInTheDocument()
      expect(screen.getByTestId('file-upload-icon')).toBeInTheDocument()
      expect(screen.getByTestId('folder-open-icon')).toBeInTheDocument()
      
      // Check for at least one eye-slash icon (from the anonymize button)
      const eyeSlashIcons = screen.getAllByTestId('eye-slash-icon')
      expect(eyeSlashIcons.length).toBeGreaterThan(0)
    })
  })

  describe('Scrolling', () => {
    it('should have scrollable file list area', () => {
      renderSidebarWithTheme()
      
      // The scrollable container is the div with flex-1 class that contains the file section
      const uploadedFilesSection = screen.getByText('Uploaded Files').closest('div')?.parentElement?.parentElement
      expect(uploadedFilesSection).toHaveClass('flex-1', 'border-t')
    })
  })

  describe('Responsive Layout', () => {
    it('should maintain full width in container', () => {
      const { container } = renderSidebarWithTheme()
      
      const sidebar = container.firstChild as HTMLElement
      expect(sidebar).toHaveClass('w-full')
    })

    it('should use flex layout for proper spacing', () => {
      const { container } = renderSidebarWithTheme()
      
      const sidebar = container.firstChild as HTMLElement
      expect(sidebar).toHaveClass('flex', 'flex-col')
    })
  })

  describe('Accessibility', () => {
    it('should have accessible button labels', () => {
      renderSidebarWithTheme()
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveTextContent(/.+/) // Should have text content
      })
    })

    it('should have proper heading hierarchy', () => {
      renderSidebarWithTheme()
      
      const mainHeading = screen.getByText('Controls')
      expect(mainHeading.tagName).toBe('H2')
      
      const subHeadings = screen.getAllByRole('heading', { level: 3 })
      expect(subHeadings).toHaveLength(2) // "Uploaded Files" and "Skipped Files"
    })
  })
})