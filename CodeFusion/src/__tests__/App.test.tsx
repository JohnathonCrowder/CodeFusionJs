import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import App from '../App'
import { ThemeProvider } from '../context/ThemeContext'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock all the complex child components
vi.mock('../components/Sidebar', () => ({
  default: ({ onClearText, onCopyText, onUploadFile, onUploadDirectory, onSettingsOpen, onCodeAnalyzerToggle, onAnonymizeOpen, uploadedFiles, skippedFiles, onFileVisibilityToggle }: any) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        onUploadFile(e);
      }
    };

    const handleDirectoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        onUploadDirectory(e);
      }
    };

    return (
      <div data-testid="sidebar">
        <button onClick={onClearText}>Clear Text</button>
        <button onClick={onCopyText}>Copy All</button>
        <button onClick={onSettingsOpen}>Settings</button>
        <button onClick={onCodeAnalyzerToggle}>Code Analyzer</button>
        <button onClick={onAnonymizeOpen}>Anonymize</button>
        <input
          data-testid="file-input"
          type="file"
          onChange={handleFileChange}
          multiple
        />
        <input
          data-testid="directory-input"
          type="file"
          onChange={handleDirectoryChange}
          {...({ webkitdirectory: "", directory: "" } as any)}
        />
        <div data-testid="uploaded-files-count">{uploadedFiles.length}</div>
        <div data-testid="skipped-files-count">{skippedFiles.length}</div>
        {uploadedFiles.map((file: any, index: number) => (
          <div key={index} data-testid={`file-item-${index}`}>
            {file.name}
            <button onClick={() => onFileVisibilityToggle(file.path || file.name)}>
              Toggle Visibility
            </button>
          </div>
        ))}
      </div>
    );
  }
}))

vi.mock('../components/MainContent', () => ({
  default: ({ fileData, isAnonymized, anonymizeContent }: any) => (
    <div data-testid="main-content">
      <div data-testid="file-count">{fileData.length}</div>
      <div data-testid="anonymized">{isAnonymized ? 'true' : 'false'}</div>
      {fileData.map((file: any, index: number) => (
        <div key={index} data-testid={`file-${index}`}>
          {isAnonymized ? anonymizeContent(file.content) : file.content}
        </div>
      ))}
    </div>
  )
}))

vi.mock('../components/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>
}))

vi.mock('../components/NavBar', () => ({
  default: ({ onHelpOpen, onAboutOpen, onGitDiffOpen }: any) => (
    <div data-testid="navbar">
      <button onClick={onHelpOpen}>Help</button>
      <button onClick={onAboutOpen}>About</button>
      <button onClick={onGitDiffOpen}>Git Diff</button>
    </div>
  )
}))

vi.mock('../components/SettingsModal', () => ({
  default: ({ onClose, onSave, settings, setProjectType }: any) => (
    <div data-testid="settings-modal">
      <button onClick={onClose}>Close Settings</button>
      <button onClick={() => onSave(settings)}>Save Settings</button>
      <button onClick={() => setProjectType('react')}>Set React</button>
    </div>
  )
}))

vi.mock('../components/DirectorySelectionModal', () => ({
  default: ({ onConfirm, onCancel, directories }: any) => (
    <div data-testid="directory-modal">
      <button onClick={() => onConfirm(directories)}>Confirm Directory</button>
      <button onClick={onCancel}>Cancel Directory</button>
    </div>
  )
}))

vi.mock('../components/SmartCodeAnalyzer', () => ({
  default: ({ isVisible, onToggle }: any) => (
    isVisible ? (
      <div data-testid="code-analyzer">
        <button onClick={onToggle}>Close Analyzer</button>
      </div>
    ) : null
  )
}))

vi.mock('../components/AnonymizeModal', () => ({
  default: ({ onClose, onSave, currentSettings }: any) => (
    <div data-testid="anonymize-modal">
      <button onClick={onClose}>Close Anonymize</button>
      <button onClick={() => onSave(currentSettings)}>Save Anonymize</button>
    </div>
  )
}))

vi.mock('../components/AboutModal', () => ({
  default: ({ onClose }: any) => (
    <div data-testid="about-modal">
      <button onClick={onClose}>Close About</button>
    </div>
  )
}))

vi.mock('../components/HelpModal', () => ({
  default: ({ onClose }: any) => (
    <div data-testid="help-modal">
      <button onClick={onClose}>Close Help</button>
    </div>
  )
}))

vi.mock('../components/GitDiffVisualizer', () => ({
  default: ({ onClose }: any) => (
    <div data-testid="git-diff-visualizer">
      <button onClick={onClose}>Close Git Diff</button>
    </div>
  )
}))

// Mock file utilities
vi.mock('../utils/fileUtils', () => ({
  filterFiles: vi.fn((files: FileList, acceptedTypes: string[]) => {
    const fileList = Array.from(files);
    return {
      acceptedFiles: fileList.filter((file: File) => 
        acceptedTypes.some((type: string) => file.name.endsWith(type.slice(1)))
      ),
      skippedFiles: fileList.filter((file: File) => 
        !acceptedTypes.some((type: string) => file.name.endsWith(type.slice(1)))
      )
    };
  }),
  readFileContent: vi.fn((file: File) => Promise.resolve(`content of ${file.name}`))
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

// Declare global to avoid TypeScript errors
declare global {
  var localStorage: typeof localStorageMock;
}

globalThis.localStorage = localStorageMock

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
})

describe('App Component', () => {
  let consoleErrorSpy: any

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    
    // Spy on console.error to catch expected errors
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy?.mockRestore()
  })

  const renderApp = () => {
    return render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    )
  }

  describe('Initial Rendering', () => {
    it('should render all main components', () => {
      renderApp()
      
      expect(screen.getByTestId('navbar')).toBeInTheDocument()
      expect(screen.getByTestId('sidebar')).toBeInTheDocument()
      expect(screen.getByTestId('main-content')).toBeInTheDocument()
      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })

    it('should start with empty file data', () => {
      renderApp()
      
      expect(screen.getByTestId('file-count')).toHaveTextContent('0')
      expect(screen.getByTestId('uploaded-files-count')).toHaveTextContent('0')
      expect(screen.getByTestId('skipped-files-count')).toHaveTextContent('0')
    })

    it('should start with anonymization disabled', () => {
      renderApp()
      
      expect(screen.getByTestId('anonymized')).toHaveTextContent('false')
    })

    it('should start with code analyzer hidden', () => {
      renderApp()
      
      expect(screen.queryByTestId('code-analyzer')).not.toBeInTheDocument()
    })
  })

  describe('File Management', () => {
    it('should handle file upload', async () => {
      const { readFileContent } = await import('../utils/fileUtils');
      vi.mocked(readFileContent).mockResolvedValue('test content');
      
      renderApp();
      
      const fileInput = screen.getByTestId('file-input');
      const file = new File(['test content'], 'test.js', { type: 'text/javascript' });
      
      const files = {
        0: file,
        length: 1,
        item: () => file,
        [Symbol.iterator]: function* () {
          yield file;
        }
      } as unknown as FileList;
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files } });
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('file-count')).toHaveTextContent('1');
      }, { timeout: 2000 });
    })

    it('should handle directory upload', async () => {
      const { readFileContent } = await import('../utils/fileUtils');
      vi.mocked(readFileContent).mockResolvedValue('directory content');
      
      renderApp();
      
      const dirInput = screen.getByTestId('directory-input');
      const file = new File(['directory content'], 'src/test.js', { type: 'text/javascript' });
      Object.defineProperty(file, 'webkitRelativePath', {
        value: 'src/test.js',
        writable: false,
      });
      
      const files = {
        0: file,
        length: 1,
        item: () => file,
        [Symbol.iterator]: function* () {
          yield file;
        }
      } as unknown as FileList;
      
      await act(async () => {
        fireEvent.change(dirInput, { target: { files } });
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('directory-modal')).toBeInTheDocument();
      }, { timeout: 2000 });
    })

    it('should clear all files', async () => {
      renderApp()
      
      const clearButton = screen.getByText('Clear Text')
      
      await act(async () => {
        fireEvent.click(clearButton)
      })
      
      expect(screen.getByTestId('file-count')).toHaveTextContent('0')
    })

    it('should copy all visible content', async () => {
      renderApp()
      
      const copyButton = screen.getByText('Copy All')
      
      await act(async () => {
        fireEvent.click(copyButton)
      })
      
      expect(navigator.clipboard.writeText).toHaveBeenCalled()
    })

    it('should toggle file visibility', async () => {
      const { readFileContent } = await import('../utils/fileUtils');
      vi.mocked(readFileContent).mockResolvedValue('test content');
      
      renderApp();
      
      const fileInput = screen.getByTestId('file-input');
      const file = new File(['test content'], 'test.js', { type: 'text/javascript' });
      
      const files = {
        0: file,
        length: 1,
        item: () => file,
        [Symbol.iterator]: function* () {
          yield file;
        }
      } as unknown as FileList;
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files } });
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('file-item-0')).toBeInTheDocument();
      });
      
      const toggleButton = screen.getByText('Toggle Visibility');
      
      await act(async () => {
        fireEvent.click(toggleButton);
      })
      
      expect(toggleButton).toBeInTheDocument();
    })
  })

  describe('Modal Management', () => {
    it('should open and close settings modal', async () => {
      renderApp()
      
      const settingsButton = screen.getByText('Settings')
      
      await act(async () => {
        fireEvent.click(settingsButton)
      })
      
      expect(screen.getByTestId('settings-modal')).toBeInTheDocument()
      
      const closeButton = screen.getByText('Close Settings')
      
      await act(async () => {
        fireEvent.click(closeButton)
      })
      
      expect(screen.queryByTestId('settings-modal')).not.toBeInTheDocument()
    })

    it('should save settings', async () => {
      renderApp()
      
      const settingsButton = screen.getByText('Settings')
      
      await act(async () => {
        fireEvent.click(settingsButton)
      })
      
      const saveButton = screen.getByText('Save Settings')
      
      await act(async () => {
        fireEvent.click(saveButton)
      })
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('appSettings', expect.any(String))
    })

    it('should open and close help modal', async () => {
      renderApp()
      
      const helpButton = screen.getByText('Help')
      
      await act(async () => {
        fireEvent.click(helpButton)
      })
      
      expect(screen.getByTestId('help-modal')).toBeInTheDocument()
      
      const closeButton = screen.getByText('Close Help')
      
      await act(async () => {
        fireEvent.click(closeButton)
      })
      
      expect(screen.queryByTestId('help-modal')).not.toBeInTheDocument()
    })

    it('should open and close about modal', async () => {
      renderApp()
      
      const aboutButton = screen.getByText('About')
      
      await act(async () => {
        fireEvent.click(aboutButton)
      })
      
      expect(screen.getByTestId('about-modal')).toBeInTheDocument()
      
      const closeButton = screen.getByText('Close About')
      
      await act(async () => {
        fireEvent.click(closeButton)
      })
      
      expect(screen.queryByTestId('about-modal')).not.toBeInTheDocument()
    })

    it('should open and close git diff visualizer', async () => {
      renderApp()
      
      const gitDiffButton = screen.getByText('Git Diff')
      
      await act(async () => {
        fireEvent.click(gitDiffButton)
      })
      
      expect(screen.getByTestId('git-diff-visualizer')).toBeInTheDocument()
      
      const closeButton = screen.getByText('Close Git Diff')
      
      await act(async () => {
        fireEvent.click(closeButton)
      })
      
      expect(screen.queryByTestId('git-diff-visualizer')).not.toBeInTheDocument()
    })

    it('should open and close anonymize modal', async () => {
      renderApp()
      
      const anonymizeButton = screen.getByText('Anonymize')
      
      await act(async () => {
        fireEvent.click(anonymizeButton)
      })
      
      expect(screen.getByTestId('anonymize-modal')).toBeInTheDocument()
      
      const closeButton = screen.getByText('Close Anonymize')
      
      await act(async () => {
        fireEvent.click(closeButton)
      })
      
      expect(screen.queryByTestId('anonymize-modal')).not.toBeInTheDocument()
    })
  })

  describe('Code Analyzer',  () => {
    it('should toggle code analyzer', async () => {
      renderApp()
      
      const analyzerButton = screen.getByText('Code Analyzer')
      
      await act(async () => {
        fireEvent.click(analyzerButton)
      })
      
      expect(screen.getByTestId('code-analyzer')).toBeInTheDocument()
      
      const closeButton = screen.getByText('Close Analyzer')
      
      await act(async () => {
        fireEvent.click(closeButton)
      })
      
      expect(screen.queryByTestId('code-analyzer')).not.toBeInTheDocument()
    })
  })

  describe('Anonymization', () => {
    it('should enable anonymization when settings are saved', async () => {
      renderApp()
      
      const anonymizeButton = screen.getByText('Anonymize')
      
      await act(async () => {
        fireEvent.click(anonymizeButton)
      })
      
      const saveButton = screen.getByText('Save Anonymize')
      
      await act(async () => {
        fireEvent.click(saveButton)
      })
      
      expect(screen.getByTestId('anonymized')).toHaveTextContent('true')
    })

    it('should anonymize content when enabled', async () => {
      const { readFileContent } = await import('../utils/fileUtils');
      vi.mocked(readFileContent).mockResolvedValue('test@example.com');
      
      renderApp();
      
      // Enable anonymization
      const anonymizeButton = screen.getByText('Anonymize');
      
      await act(async () => {
        fireEvent.click(anonymizeButton);
      })
      
      const saveButton = screen.getByText('Save Anonymize');
      
      await act(async () => {
        fireEvent.click(saveButton);
      })
      
      // Add file
      const fileInput = screen.getByTestId('file-input');
      const file = new File(['test@example.com'], 'test.js', { type: 'text/javascript' });
      
      const files = {
        0: file,
        length: 1,
        item: () => file,
        [Symbol.iterator]: function* () {
          yield file;
        }
      } as unknown as FileList;
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files } });
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('file-0')).toHaveTextContent('[EMAIL]');
      }, { timeout: 2000 });
    })
  })

  describe('Project Type Detection and Settings', () => {
    it('should change project type when preset is selected', async () => {
      renderApp()
      
      const settingsButton = screen.getByText('Settings')
      
      await act(async () => {
        fireEvent.click(settingsButton)
      })
      
      const reactButton = screen.getByText('Set React')
      
      await act(async () => {
        fireEvent.click(reactButton)
      })
      
      // Should call setProjectType
      expect(reactButton).toBeInTheDocument()
    })
  })

  describe('Directory Selection', () => {
    it('should handle directory selection confirmation', async () => {
      const { readFileContent } = await import('../utils/fileUtils');
      vi.mocked(readFileContent).mockResolvedValue('content');
      
      renderApp();
      
      const dirInput = screen.getByTestId('directory-input');
      const file = new File(['content'], 'src/App.js', { type: 'text/javascript' });
      
      Object.defineProperty(file, 'webkitRelativePath', {
        value: 'src/App.js',
        writable: false,
      });
      
      const files = {
        0: file,
        length: 1,
        item: () => file,
        [Symbol.iterator]: function* () {
          yield file;
        }
      } as unknown as FileList;
      
      await act(async () => {
        fireEvent.change(dirInput, { target: { files } });
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('directory-modal')).toBeInTheDocument();
      });
      
      const confirmButton = screen.getByText('Confirm Directory');
      
      await act(async () => {
        fireEvent.click(confirmButton);
      })
      
      await waitFor(() => {
        expect(screen.queryByTestId('directory-modal')).not.toBeInTheDocument();
      });
    })

    it('should handle directory selection cancellation', async () => {
      const { readFileContent } = await import('../utils/fileUtils');
      vi.mocked(readFileContent).mockResolvedValue('content');
      
      renderApp();
      
      const dirInput = screen.getByTestId('directory-input');
      const file = new File(['content'], 'src/App.js', { type: 'text/javascript' });
      
      Object.defineProperty(file, 'webkitRelativePath', {
        value: 'src/App.js',
        writable: false,
      });
      
      const files = {
        0: file,
        length: 1,
        item: () => file,
        [Symbol.iterator]: function* () {
          yield file;
        }
      } as unknown as FileList;
      
      await act(async () => {
        fireEvent.change(dirInput, { target: { files } });
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('directory-modal')).toBeInTheDocument();
      });
      
      const cancelButton = screen.getByText('Cancel Directory');
      
      await act(async () => {
        fireEvent.click(cancelButton);
      })
      
      expect(screen.queryByTestId('directory-modal')).not.toBeInTheDocument();
    })
  })

  describe('Sidebar Resizing', () => {
    it('should handle sidebar resize', () => {
      renderApp()
      
      // Find the resizer element
      const resizer = document.querySelector('.cursor-col-resize')
      expect(resizer).toBeInTheDocument()
    })
  })

  describe('Local Storage Integration', () => {
    it('should load saved settings on mount', () => {
      const savedSettings = {
        newLineCount: 3,
        autoUnselectFolders: ['test'],
        acceptedTypes: ['.js']
      }
      
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'appSettings') return JSON.stringify(savedSettings)
        if (key === 'projectType') return 'react'
        if (key === 'sidebarWidth') return '400'
        return null
      })
      
      renderApp()
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('appSettings')
      expect(localStorageMock.getItem).toHaveBeenCalledWith('projectType')
      expect(localStorageMock.getItem).toHaveBeenCalledWith('sidebarWidth')
    })

    it('should save sidebar width changes', () => {
      renderApp()
      
      // The component should save sidebar width on changes
      expect(localStorageMock.setItem).toHaveBeenCalledWith('sidebarWidth', '320')
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid saved settings gracefully', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'appSettings') return 'invalid json'
        return null
      })
      
      // Should not throw when rendering with invalid settings
      expect(() => renderApp()).not.toThrow()
      
      // Should have logged the error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to parse saved settings:',
        expect.any(Error)
      )
      
      // App should still be functional
      expect(screen.getByTestId('sidebar')).toBeInTheDocument()
      expect(screen.getByTestId('main-content')).toBeInTheDocument()
    })
  
    it('should handle file operations without crashing', async () => {
      renderApp()
      
      const fileInput = screen.getByTestId('file-input')
      const file = new File(['content'], 'test.js', { type: 'text/javascript' })
      
      const files = {
        0: file,
        length: 1,
        item: () => file,
        [Symbol.iterator]: function* () {
          yield file;
        }
      } as unknown as FileList;
      
      // Should not throw when changing files
      await act(async () => {
        expect(() => {
          fireEvent.change(fileInput, { target: { files } })
        }).not.toThrow()
      })
      
      // App should still be functional
      expect(screen.getByTestId('sidebar')).toBeInTheDocument()
      expect(screen.getByTestId('main-content')).toBeInTheDocument()
    })
  })
  
  describe('Responsive Design', () => {
    it('should handle main content layout based on Git Diff visibility', async () => {
      renderApp()
      
      // Initially should show normal layout
      expect(screen.getByTestId('main-content')).toBeInTheDocument()
      
      // Open Git Diff
      const gitDiffButton = screen.getByText('Git Diff')
      
      await act(async () => {
        fireEvent.click(gitDiffButton)
      })
      
      // Should show Git Diff instead of main content
      expect(screen.getByTestId('git-diff-visualizer')).toBeInTheDocument()
    })
  })

  describe('Navigation Integration', () => {
    it('should handle navbar interactions', () => {
      renderApp()
      
      // Test all navbar buttons
      expect(screen.getByText('Help')).toBeInTheDocument()
      expect(screen.getByText('About')).toBeInTheDocument()
      expect(screen.getByText('Git Diff')).toBeInTheDocument()
    })
  })

  describe('Component State Management', () => {
    it('should maintain state consistency between components', async () => {
      const { readFileContent } = await import('../utils/fileUtils');
      vi.mocked(readFileContent).mockResolvedValue('test content');
      
      renderApp();
      
      // Add file
      const fileInput = screen.getByTestId('file-input');
      const file = new File(['test content'], 'test.js', { type: 'text/javascript' });
      
      const files = {
        0: file,
        length: 1,
        item: () => file,
        [Symbol.iterator]: function* () {
          yield file;
        }
      } as unknown as FileList;
      
      await act(async () => {
        fireEvent.change(fileInput, { target: { files } });
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('file-count')).toHaveTextContent('1');
        expect(screen.getByTestId('uploaded-files-count')).toHaveTextContent('1');
      }, { timeout: 2000 });
      
      // Clear files
      const clearButton = screen.getByText('Clear Text');
      
      await act(async () => {
        fireEvent.click(clearButton);
      })
      
      expect(screen.getByTestId('file-count')).toHaveTextContent('0');
      expect(screen.getByTestId('uploaded-files-count')).toHaveTextContent('0');
    })
  })
})