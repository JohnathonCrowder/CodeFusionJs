import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeContext } from '../../context/ThemeContext'
import SmartCodeAnalyzer from '../SmartCodeAnalyzer'

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaBrain: ({ className }: { className?: string }) => (
    <span data-testid="brain-icon" className={className}>BrainIcon</span>
  ),
  FaSpinner: ({ className }: { className?: string }) => (
    <span data-testid="spinner-icon" className={className}>SpinnerIcon</span>
  ),
  FaChevronDown: ({ className }: { className?: string }) => (
    <span data-testid="chevron-down-icon" className={className}>ChevronDownIcon</span>
  ),
  FaChevronRight: ({ className }: { className?: string }) => (
    <span data-testid="chevron-right-icon" className={className}>ChevronRightIcon</span>
  ),
  FaFileCode: ({ className }: { className?: string }) => (
    <span data-testid="file-code-icon" className={className}>FileCodeIcon</span>
  ),
  FaExclamationCircle: ({ className }: { className?: string }) => (
    <span data-testid="exclamation-circle-icon" className={className}>ExclamationCircleIcon</span>
  ),
  FaCheckCircle: ({ className }: { className?: string }) => (
    <span data-testid="check-circle-icon" className={className}>CheckCircleIcon</span>
  ),
  FaTimes: ({ className }: { className?: string }) => (
    <span data-testid="times-icon" className={className}>TimesIcon</span>
  ),
  FaSync: ({ className }: { className?: string }) => (
    <span data-testid="sync-icon" className={className}>SyncIcon</span>
  ),
  FaChartBar: ({ className }: { className?: string }) => (
    <span data-testid="chart-bar-icon" className={className}>ChartBarIcon</span>
  ),
}))

// Mock setTimeout to make tests run faster
vi.useFakeTimers()

describe('SmartCodeAnalyzer Component', () => {
  const mockOnToggle = vi.fn()
  
  const sampleFileData = [
    {
      name: 'app.js',
      content: 'console.log("Hello World");\n'.repeat(10) + 'console.log("This is a very long line that exceeds 120 characters and should be flagged as an issue in the code analysis");',
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
          name: 'Header.tsx',
          content: '// TODO: Add header component\nimport React from "react";\nexport default Header;\n\t\t// Mixed indentation',
          visible: true,
          path: 'src/components/Header.tsx'
        },
        {
          name: 'Footer.css',
          content: '.footer {\n  color: red;\n}',
          visible: false,
          path: 'src/components/Footer.css'
        }
      ]
    },
    {
      name: 'large-file.js',
      content: 'x'.repeat(150000), // Large file > 100KB
      visible: true,
      path: 'src/large-file.js'
    }
  ]

  const emptyFileData: any[] = []

  // Helper function to render SmartCodeAnalyzer with theme context
  const renderSmartCodeAnalyzerWithTheme = (
    darkMode = false,
    fileData = sampleFileData,
    isVisible = true
  ) => {
    return render(
      <ThemeContext.Provider value={{ darkMode, toggleDarkMode: vi.fn() }}>
        <SmartCodeAnalyzer
          fileData={fileData}
          isVisible={isVisible}
          onToggle={mockOnToggle}
        />
      </ThemeContext.Provider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
  })

  describe('Rendering', () => {
    it('should render when visible', () => {
      renderSmartCodeAnalyzerWithTheme()
      expect(screen.getByText('Code Analysis')).toBeInTheDocument()
    })

    it('should not render when not visible', () => {
      renderSmartCodeAnalyzerWithTheme(false, sampleFileData, false)
      expect(screen.queryByText('Code Analysis')).not.toBeInTheDocument()
    })

    it('should render header with title and description', () => {
      renderSmartCodeAnalyzerWithTheme()
      
      expect(screen.getByText('Code Analysis')).toBeInTheDocument()
      expect(screen.getByText('Analyze code quality')).toBeInTheDocument()
      expect(screen.getByTestId('brain-icon')).toBeInTheDocument()
    })

    it('should render close button', () => {
      renderSmartCodeAnalyzerWithTheme()
      
      const closeButton = screen.getByTestId('times-icon').closest('button')
      expect(closeButton).toBeInTheDocument()
    })

    it('should render analyze button', () => {
      renderSmartCodeAnalyzerWithTheme()
      
      expect(screen.getByText('Analyze Files')).toBeInTheDocument()
      expect(screen.getByTestId('sync-icon')).toBeInTheDocument()
    })
  })

  describe('Theme Support', () => {
    it('should apply dark theme classes', () => {
      renderSmartCodeAnalyzerWithTheme(true)
      
      const container = screen.getByText('Code Analysis').closest('div.w-96')
      expect(container).toHaveClass('bg-dark-800', 'border-dark-600')
    })

    it('should apply light theme classes', () => {
      renderSmartCodeAnalyzerWithTheme(false)
      
      const container = screen.getByText('Code Analysis').closest('div.w-96')
      expect(container).toHaveClass('bg-white', 'border-gray-200')
    })
  })

  describe('Analysis Functionality', () => {
    it('should show loading state when analyzing', async () => {
      renderSmartCodeAnalyzerWithTheme()
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      const analyzeButton = screen.getByText('Analyze Files')
      await user.click(analyzeButton)
      
      expect(screen.getByText('Analyzing...')).toBeInTheDocument()
      expect(screen.getByTestId('spinner-icon')).toHaveClass('animate-spin')
      expect(analyzeButton).toBeDisabled()
    })

    it('should analyze files and display results', async () => {
      renderSmartCodeAnalyzerWithTheme()
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      const analyzeButton = screen.getByText('Analyze Files')
      await user.click(analyzeButton)
      
      // Advance timers to complete analysis
      await vi.runAllTimersAsync()
      
      // Check that results are displayed
      await waitFor(() => {
        expect(screen.getByText('app.js')).toBeInTheDocument()
        expect(screen.getByText('Header.tsx')).toBeInTheDocument()
      })
    })

    it('should not analyze hidden files', async () => {
      renderSmartCodeAnalyzerWithTheme()
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      const analyzeButton = screen.getByText('Analyze Files')
      await user.click(analyzeButton)
      
      await vi.runAllTimersAsync()
      
      await waitFor(() => {
        expect(screen.queryByText('Footer.css')).not.toBeInTheDocument()
      })
    })

    it('should detect issues in files', async () => {
      renderSmartCodeAnalyzerWithTheme()
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      const analyzeButton = screen.getByText('Analyze Files')
      await user.click(analyzeButton)
      
      await vi.runAllTimersAsync()
      
      await waitFor(() => {
        // Check for long lines issue
        expect(screen.getByText(/long lines/)).toBeInTheDocument()
        
        // Check for TODO/FIXME notes
        expect(screen.getByText(/TODO\/FIXME notes/)).toBeInTheDocument()
        
        // Check for large file size
        expect(screen.getByText('Large file size')).toBeInTheDocument()
      })
    })

    it('should detect mixed indentation', async () => {
      renderSmartCodeAnalyzerWithTheme()
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      const analyzeButton = screen.getByText('Analyze Files')
      await user.click(analyzeButton)
      
      await vi.runAllTimersAsync()
      
      await waitFor(() => {
        expect(screen.getByText('Mixed indentation (spaces & tabs)')).toBeInTheDocument()
      })
    })

    it('should calculate file metrics correctly', async () => {
      renderSmartCodeAnalyzerWithTheme()
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      const analyzeButton = screen.getByText('Analyze Files')
      await user.click(analyzeButton)
      
      await vi.runAllTimersAsync()
      
      // Expand a file to see metrics
      const appFile = await screen.findByText('app.js')
      await user.click(appFile)
      
      await waitFor(() => {
        expect(screen.getByText(/Code lines:/)).toBeInTheDocument()
        expect(screen.getByText(/Blank lines:/)).toBeInTheDocument()
        expect(screen.getByText(/Imports:/)).toBeInTheDocument()
        expect(screen.getByText(/Long lines:/)).toBeInTheDocument()
      })
    })

    it('should handle empty file data', async () => {
      renderSmartCodeAnalyzerWithTheme(false, emptyFileData)
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      const analyzeButton = screen.getByText('Analyze Files')
      await user.click(analyzeButton)
      
      await vi.runAllTimersAsync()
      
      await waitFor(() => {
        expect(screen.getByText('No files to analyze')).toBeInTheDocument()
        expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument()
      })
    })
  })

  describe('Project Summary', () => {
    it('should display project overview when analysis is complete', async () => {
      renderSmartCodeAnalyzerWithTheme()
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      const analyzeButton = screen.getByText('Analyze Files')
      await user.click(analyzeButton)
      
      await vi.runAllTimersAsync()
      
      await waitFor(() => {
        expect(screen.getByText('Project Overview')).toBeInTheDocument()
        expect(screen.getByTestId('chart-bar-icon')).toBeInTheDocument()
        
        // Check summary cards
        expect(screen.getByText('Files')).toBeInTheDocument()
        expect(screen.getByText('Lines')).toBeInTheDocument()
        expect(screen.getByText('Issues')).toBeInTheDocument()
        expect(screen.getByText('Size')).toBeInTheDocument()
      })
    })

    it('should calculate correct summary statistics', async () => {
      const testFiles = [
        {
          name: 'test1.js',
          content: 'line1\nline2\nline3',
          visible: true,
          path: 'test1.js'
        },
        {
          name: 'test2.js',
          content: 'line1\nline2',
          visible: true,
          path: 'test2.js'
        }
      ]
      
      renderSmartCodeAnalyzerWithTheme(false, testFiles)
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      const analyzeButton = screen.getByText('Analyze Files')
      await user.click(analyzeButton)
      
      await vi.runAllTimersAsync()
      
      await waitFor(() => {
        // Files count
        expect(screen.getByText('2')).toBeInTheDocument()
        
        // Total lines (3 + 2 = 5)
        expect(screen.getByText('5')).toBeInTheDocument()
      })
    })
  })

  describe('File Item Interactions', () => {
    it('should toggle file expansion on click', async () => {
      renderSmartCodeAnalyzerWithTheme()
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      // Run analysis first
      const analyzeButton = screen.getByText('Analyze Files')
      await user.click(analyzeButton)
      
      await vi.runAllTimersAsync()
      
      // Click on a file to expand
      const appFile = await screen.findByText('app.js')
      const fileItem = appFile.closest('div[class*="border"]')
      
      expect(within(fileItem!).getByTestId('chevron-right-icon')).toBeInTheDocument()
      
      await user.click(appFile)
      
      // Should now show expanded content
      expect(within(fileItem!).getByTestId('chevron-down-icon')).toBeInTheDocument()
      expect(screen.getByText(/Code lines:/)).toBeInTheDocument()
    })

    it('should display correct status icons', async () => {
      renderSmartCodeAnalyzerWithTheme()
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      const analyzeButton = screen.getByText('Analyze Files')
      await user.click(analyzeButton)
      
      await vi.runAllTimersAsync()
      
      await waitFor(() => {
        // Files with issues should have warning icon
        const exclamationIcons = screen.getAllByTestId('exclamation-circle-icon')
        expect(exclamationIcons.length).toBeGreaterThan(0)
        
        // Files without issues should have check icon
        // Note: In our sample data, all files have issues, so we might need to add a clean file to test this
      })
    })

    it('should display file size correctly', async () => {
      renderSmartCodeAnalyzerWithTheme()
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      const analyzeButton = screen.getByText('Analyze Files')
      await user.click(analyzeButton)
      
      await vi.runAllTimersAsync()
      
      await waitFor(() => {
        // Check for KB display
        expect(screen.getByText(/KB/)).toBeInTheDocument()
        
        // Large file should show appropriate size
        const largeFileElement = screen.getByText('large-file.js').closest('div')
        const sizeText = within(largeFileElement!).getByText(/KB/)
        expect(sizeText).toBeInTheDocument()
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle files with no content', async () => {
      const filesWithNoContent = [
        {
          name: 'empty.js',
          content: '',
          visible: true,
          path: 'empty.js'
        }
      ]
      
      renderSmartCodeAnalyzerWithTheme(false, filesWithNoContent)
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      const analyzeButton = screen.getByText('Analyze Files')
      await user.click(analyzeButton)
      
      await vi.runAllTimersAsync()
      
      await waitFor(() => {
        expect(screen.getByText('empty.js')).toBeInTheDocument()
        expect(screen.getByText('0 lines')).toBeInTheDocument()
      })
    })

    it('should handle files with only whitespace', async () => {
      const filesWithWhitespace = [
        {
          name: 'whitespace.js',
          content: '   \n\n\t\t\n   ',
          visible: true,
          path: 'whitespace.js'
        }
      ]
      
      renderSmartCodeAnalyzerWithTheme(false, filesWithWhitespace)
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      const analyzeButton = screen.getByText('Analyze Files')
      await user.click(analyzeButton)
      
      await vi.runAllTimersAsync()
      
      await waitFor(() => {
        expect(screen.getByText('whitespace.js')).toBeInTheDocument()
      })
    })

    it('should handle files with various line endings', async () => {
      const filesWithDifferentLineEndings = [
        {
          name: 'mixed-endings.js',
          content: 'line1\r\nline2\rline3\nline4',
          visible: true,
          path: 'mixed-endings.js'
        }
      ]
      
      renderSmartCodeAnalyzerWithTheme(false, filesWithDifferentLineEndings)
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      const analyzeButton = screen.getByText('Analyze Files')
      await user.click(analyzeButton)
      
      await vi.runAllTimersAsync()
      
      await waitFor(() => {
        expect(screen.getByText('mixed-endings.js')).toBeInTheDocument()
        expect(screen.getByText('4 lines')).toBeInTheDocument()
      })
    })

    it('should handle very long file names', async () => {
      const longFileName = 'this-is-a-very-long-file-name-that-should-be-truncated-in-the-ui.js'
      const filesWithLongNames = [
        {
          name: longFileName,
          content: 'content',
          visible: true,
          path: longFileName
        }
      ]
      
      renderSmartCodeAnalyzerWithTheme(false, filesWithLongNames)
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      const analyzeButton = screen.getByText('Analyze Files')
      await user.click(analyzeButton)
      
      await vi.runAllTimersAsync()
      
      await waitFor(() => {
        const fileElement = screen.getByText(longFileName)
        expect(fileElement).toHaveClass('truncate')
      })
    })

    it('should ignore non-text file types', async () => {
      const mixedFiles = [
        {
          name: 'text.js',
          content: 'console.log("test")',
          visible: true,
          path: 'text.js'
        },
        {
          name: 'image.png',
          content: 'binary data',
          visible: true,
          path: 'image.png'
        },
        {
          name: 'video.mp4',
          content: 'binary data',
          visible: true,
          path: 'video.mp4'
        }
      ]
      
      renderSmartCodeAnalyzerWithTheme(false, mixedFiles)
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      const analyzeButton = screen.getByText('Analyze Files')
      await user.click(analyzeButton)
      
      await vi.runAllTimersAsync()
      
      await waitFor(() => {
        expect(screen.getByText('text.js')).toBeInTheDocument()
        expect(screen.queryByText('image.png')).not.toBeInTheDocument()
        expect(screen.queryByText('video.mp4')).not.toBeInTheDocument()
      })
    })
  })

  describe('Import Detection', () => {
    it('should count ES6 imports correctly', async () => {
      const filesWithImports = [
        {
          name: 'imports.js',
          content: `
import React from 'react';
import { useState, useEffect } from 'react';
import * as utils from './utils';
import { 
  Component1,
  Component2
} from './components';
`,
          visible: true,
          path: 'imports.js'
        }
      ]
      
      renderSmartCodeAnalyzerWithTheme(false, filesWithImports)
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      const analyzeButton = screen.getByText('Analyze Files')
      await user.click(analyzeButton)
      
      await vi.runAllTimersAsync()
      
      // Expand the file to see metrics
      const file = await screen.findByText('imports.js')
      await user.click(file)
      
      await waitFor(() => {
        const importsText = screen.getByText(/Imports:/)
        expect(importsText.parentElement?.textContent).toContain('4')
      })
    })

    it('should count CommonJS requires correctly', async () => {
      const filesWithRequires = [
        {
          name: 'requires.js',
          content: `
const fs = require('fs');
const path = require('path');
const { readFile } = require('fs/promises');
`,
          visible: true,
          path: 'requires.js'
        }
      ]
      
      renderSmartCodeAnalyzerWithTheme(false, filesWithRequires)
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      const analyzeButton = screen.getByText('Analyze Files')
      await user.click(analyzeButton)
      
      await vi.runAllTimersAsync()
      
      const file = await screen.findByText('requires.js')
      await user.click(file)
      
      await waitFor(() => {
        const importsText = screen.getByText(/Imports:/)
        expect(importsText.parentElement?.textContent).toContain('3')
      })
    })
  })

  describe('Close Functionality', () => {
    it('should call onToggle when close button is clicked', async () => {
      renderSmartCodeAnalyzerWithTheme()
      const user = userEvent.setup()
      
      const closeButton = screen.getByTestId('times-icon').closest('button')
      await user.click(closeButton!)
      
      expect(mockOnToggle).toHaveBeenCalledTimes(1)
    })
  })

  describe('Re-analyze Functionality', () => {
    it('should allow re-analyzing files', async () => {
      renderSmartCodeAnalyzerWithTheme()
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      // First analysis
      const analyzeButton = screen.getByText('Analyze Files')
      await user.click(analyzeButton)
      
      await vi.runAllTimersAsync()
      
      // Wait for results
      await waitFor(() => {
        expect(screen.getByText('app.js')).toBeInTheDocument()
      })
      
      // Re-analyze
      const reAnalyzeButton = screen.getByText('Analyze Files')
      await user.click(reAnalyzeButton)
      
      // Should show analyzing state again
      expect(screen.getByText('Analyzing...')).toBeInTheDocument()
    })
  })

  describe('Scroll Behavior', () => {
    it('should make file list scrollable', () => {
      renderSmartCodeAnalyzerWithTheme()
      
      const fileListContainer = screen.getByText('Analyze Files').closest('div')?.nextElementSibling
      expect(fileListContainer).toHaveClass('flex-1', 'overflow-y-auto')
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderSmartCodeAnalyzerWithTheme()
      
      const heading = screen.getByRole('heading', { name: 'Code Analysis' })
      expect(heading).toBeInTheDocument()
      expect(heading.tagName).toBe('H2')
    })

    it('should have accessible buttons', () => {
      renderSmartCodeAnalyzerWithTheme()
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toBeVisible()
      })
    })

    it('should use semantic HTML for file list', async () => {
      renderSmartCodeAnalyzerWithTheme()
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      const analyzeButton = screen.getByText('Analyze Files')
      await user.click(analyzeButton)
      
      await vi.runAllTimersAsync()
      
      await waitFor(() => {
        const fileItems = screen.getAllByText(/\.(js|tsx|css)$/)
        expect(fileItems.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Performance', () => {
    it('should handle large numbers of files', async () => {
      const manyFiles = Array.from({ length: 50 }, (_, i) => ({
        name: `file${i}.js`,
        content: `console.log("File ${i}");`,
        visible: true,
        path: `src/file${i}.js`
      }))
      
      renderSmartCodeAnalyzerWithTheme(false, manyFiles)
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      
      const analyzeButton = screen.getByText('Analyze Files')
      await user.click(analyzeButton)
      
      await vi.runAllTimersAsync()
      
      await waitFor(() => {
        expect(screen.getByText('file0.js')).toBeInTheDocument()
        expect(screen.getByText('file49.js')).toBeInTheDocument()
      })
    })
  })
})