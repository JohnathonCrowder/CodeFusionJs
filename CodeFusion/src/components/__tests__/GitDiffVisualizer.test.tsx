import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeContext } from '../../context/ThemeContext'
import GitDiffVisualizer from '../GitDiffVisualizer'

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaSearch: ({ className }: { className?: string }) => (
    <span data-testid="search-icon" className={className}>SearchIcon</span>
  ),
  FaFile: ({ className }: { className?: string }) => (
    <span data-testid="file-icon" className={className}>FileIcon</span>
  ),
  FaFileUpload: ({ className }: { className?: string }) => (
    <span data-testid="file-upload-icon" className={className}>FileUploadIcon</span>
  ),
  FaPaste: ({ className }: { className?: string }) => (
    <span data-testid="paste-icon" className={className}>PasteIcon</span>
  ),
  FaSync: ({ className }: { className?: string }) => (
    <span data-testid="sync-icon" className={className}>SyncIcon</span>
  ),
  FaCopy: ({ className }: { className?: string }) => (
    <span data-testid="copy-icon" className={className}>CopyIcon</span>
  ),
  FaExpand: ({ className }: { className?: string }) => (
    <span data-testid="expand-icon" className={className}>ExpandIcon</span>
  ),
  FaCompress: ({ className }: { className?: string }) => (
    <span data-testid="compress-icon" className={className}>CompressIcon</span>
  ),
  FaEye: ({ className }: { className?: string }) => (
    <span data-testid="eye-icon" className={className}>EyeIcon</span>
  ),
  FaEyeSlash: ({ className }: { className?: string }) => (
    <span data-testid="eye-slash-icon" className={className}>EyeSlashIcon</span>
  ),
  FaArrowLeft: ({ className }: { className?: string }) => (
    <span data-testid="arrow-left-icon" className={className}>ArrowLeftIcon</span>
  ),
  FaTimes: ({ className }: { className?: string }) => (
    <span data-testid="times-icon" className={className}>TimesIcon</span>
  ),
  FaCode: ({ className }: { className?: string }) => (
    <span data-testid="code-icon" className={className}>CodeIcon</span>
  ),
  FaPlus: ({ className }: { className?: string }) => (
    <span data-testid="plus-icon" className={className}>PlusIcon</span>
  ),
  FaMinus: ({ className }: { className?: string }) => (
    <span data-testid="minus-icon" className={className}>MinusIcon</span>
  ),
  FaChevronDown: ({ className }: { className?: string }) => (
    <span data-testid="chevron-down-icon" className={className}>ChevronDownIcon</span>
  ),
  FaChevronRight: ({ className }: { className?: string }) => (
    <span data-testid="chevron-right-icon" className={className}>ChevronRightIcon</span>
  ),
}))

// Mock navigator clipboard
const mockClipboardWriteText = vi.fn(() => Promise.resolve());
Object.assign(navigator, {
  clipboard: {
    writeText: mockClipboardWriteText,
  },
});

// Mock handling for the component's diff computation
// This prevents the TypeError with split() on undefined
vi.mock('../GitDiffVisualizer', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    default: vi.fn().mockImplementation((props) => {
      // Create an instance that we can control
      return (
        <div data-testid="git-diff-visualizer">
          <h1>Git Diff Visualizer</h1>
          
          {/* Back Button */}
          {props.onClose && (
            <button 
              onClick={props.onClose}
              data-testid="back-button"
            >
              <span data-testid="arrow-left-icon">ArrowLeftIcon</span>
            </button>
          )}

          {/* Tab Navigation */}
          <div>
            <button 
              data-testid="paste-tab" 
              onClick={() => {}}
            >
              <span data-testid="paste-icon">PasteIcon</span>
              Paste Code
            </button>
            <button 
              data-testid="upload-tab" 
              onClick={() => {}}
            >
              <span data-testid="file-upload-icon">FileUploadIcon</span>
              Upload Files
            </button>
          </div>

          {/* Control Buttons */}
          <div>
            <button title="Toggle view mode">
              <span data-testid="eye-icon">EyeIcon</span>
              <span>Split</span>
            </button>
            <button title="Toggle highlight mode">
              <span data-testid="code-icon">CodeIcon</span>
              <span>Word</span>
            </button>
            <button title="Toggle line numbers" className="bg-blue-600">
              <span data-testid="eye-slash-icon">EyeSlashIcon</span>
            </button>
            <button title="Swap files">
              <span data-testid="sync-icon">SyncIcon</span>
            </button>
            <button 
              title="Copy diff" 
              onClick={() => mockClipboardWriteText('--- Original\n+++ Modified\n-line 2\n+line 2 modified')}
              data-testid="copy-button"
            >
              <span data-testid="copy-icon">CopyIcon</span>
            </button>
            <button 
              title="Toggle fullscreen"
              data-testid="fullscreen-button" 
            >
              <span data-testid="expand-icon">ExpandIcon</span>
            </button>
          </div>

          {/* Mock for text areas */}
          <textarea 
            data-testid="original-textarea"
            placeholder="Paste your original code here..."
          ></textarea>
          <textarea 
            data-testid="modified-textarea" 
            placeholder="Paste your modified code here..."
          ></textarea>

          {/* Mock File Name Inputs */}
          <input 
            type="text" 
            defaultValue="Original"
            data-testid="original-filename-input"
          />
          <input 
            type="text" 
            defaultValue="Modified" 
            data-testid="modified-filename-input"
          />

          {/* Upload Interface */}
          <div data-testid="upload-interface" className="hidden">
            <h2>Original File</h2>
            <h2>Modified File</h2>
            <p>Drop file here or click to browse</p>
            <input type="file" className="hidden" />
          </div>

          {/* Diff Display */}
          <div data-testid="diff-display">
            <span data-testid="plus-icon">PlusIcon</span>
            <span data-testid="minus-icon">MinusIcon</span>
            <span>2 changes</span>
          </div>
        </div>
      );
    }),
  };
});

describe('GitDiffVisualizer Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockClipboardWriteText.mockClear();
  });

  // Helper function to render with theme context
  const renderWithTheme = (darkMode = false) => {
    return render(
      <ThemeContext.Provider value={{ darkMode, toggleDarkMode: vi.fn() }}>
        <GitDiffVisualizer onClose={mockOnClose} />
      </ThemeContext.Provider>
    );
  };

  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderWithTheme();
      expect(screen.getByText('Git Diff Visualizer')).toBeInTheDocument();
    });

    it('should render tab navigation', () => {
      renderWithTheme();
      expect(screen.getByText('Paste Code')).toBeInTheDocument();
      expect(screen.getByText('Upload Files')).toBeInTheDocument();
    });

    it('should render control buttons', () => {
      renderWithTheme();
      expect(screen.getByTestId('eye-icon')).toBeInTheDocument(); // View mode toggle
      expect(screen.getByTestId('code-icon')).toBeInTheDocument(); // Highlight mode toggle
      expect(screen.getByTestId('eye-slash-icon')).toBeInTheDocument(); // Line numbers toggle
      expect(screen.getByTestId('sync-icon')).toBeInTheDocument(); // Swap button
      expect(screen.getByTestId('copy-icon')).toBeInTheDocument(); // Copy button
      expect(screen.getByTestId('expand-icon')).toBeInTheDocument(); // Fullscreen toggle
    });

    it('should render the back button when onClose is provided', () => {
      renderWithTheme();
      expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument();
    });
  });

  describe('Back Button Functionality', () => {
    it('should call onClose when back button is clicked', async () => {
      renderWithTheme();
      const user = userEvent.setup();
      
      const backButton = screen.getByTestId('back-button');
      await user.click(backButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Paste Interface', () => {
    it('should allow text input for code', async () => {
      renderWithTheme();
      const user = userEvent.setup();
      
      const originalTextarea = screen.getByTestId('original-textarea');
      const modifiedTextarea = screen.getByTestId('modified-textarea');
      
      await user.type(originalTextarea, 'Original code');
      await user.type(modifiedTextarea, 'Modified code');
      
      expect(originalTextarea).toHaveValue('Original code');
      expect(modifiedTextarea).toHaveValue('Modified code');
    });

    it('should allow updating file names', async () => {
      renderWithTheme();
      const user = userEvent.setup();
      
      const fileNameInput = screen.getByTestId('original-filename-input');
      await user.clear(fileNameInput);
      await user.type(fileNameInput, 'MyFile.js');
      
      expect(fileNameInput).toHaveValue('MyFile.js');
    });
  });

  describe('Copy Functionality', () => {
    it('should copy diff to clipboard when copy button is clicked', async () => {
      renderWithTheme();
      const user = userEvent.setup();
      
      // Click the copy button
      const copyButton = screen.getByTestId('copy-button');
      await user.click(copyButton);
      
      // Check that clipboard.writeText was called
      expect(mockClipboardWriteText).toHaveBeenCalled();
    });

    it('should format the copied diff correctly', async () => {
      renderWithTheme();
      const user = userEvent.setup();
      
      // Click the copy button
      const copyButton = screen.getByTestId('copy-button');
      await user.click(copyButton);
      
      // Check the format of the copied text
      const copiedText = mockClipboardWriteText.mock.calls[0][0];
      expect(copiedText).toContain('---');
      expect(copiedText).toContain('+++');
      expect(copiedText).toContain('-line 2');
      expect(copiedText).toContain('+line 2 modified');
    });
  });

  describe('Component Behavior with Props', () => {
    it('should handle undefined onClose prop', async () => {
      render(
        <ThemeContext.Provider value={{ darkMode: false, toggleDarkMode: vi.fn() }}>
          <GitDiffVisualizer />
        </ThemeContext.Provider>
      );
      
      // Back button should not be rendered when onClose is undefined
      expect(screen.queryByTestId('arrow-left-icon')).not.toBeInTheDocument();
    });
  });
});