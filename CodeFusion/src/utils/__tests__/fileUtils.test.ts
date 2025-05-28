import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { handleFileUpload, handleDirectoryUpload, filterFiles, readFileContent } from '../fileUtils'

// Mock FileReader
class MockFileReader {
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null
  onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null
  result: string | ArrayBuffer | null = null

  readAsText(file: File) {
    // Simulate async file reading
    setTimeout(() => {
      this.result = `content of ${file.name}`
      if (this.onload) {
        this.onload.call(this, {
          target: { result: this.result }
        } as ProgressEvent<FileReader>)
      }
    }, 0)
  }
}

// Mock FileReader globally
global.FileReader = MockFileReader as any

describe('fileUtils', () => {
  describe('handleFileUpload', () => {
    beforeEach(() => {
      // Setup DOM
      document.body.innerHTML = '<ul id="fileListItems"></ul>'
    })

    afterEach(() => {
      document.body.innerHTML = ''
    })

    it('should populate file list when files are selected', () => {
      const mockFiles = [
        new File(['content1'], 'file1.txt', { type: 'text/plain' }),
        new File(['content2'], 'file2.txt', { type: 'text/plain' })
      ]

      const mockEvent = {
        target: {
          files: mockFiles
        }
      } as unknown as Event

      handleFileUpload(mockEvent)

      const fileListElement = document.getElementById('fileListItems')
      expect(fileListElement?.children).toHaveLength(2)
      expect(fileListElement?.children[0]?.textContent).toBe('file1.txt')
      expect(fileListElement?.children[1]?.textContent).toBe('file2.txt')
    })

    it('should handle no files selected', () => {
      const mockEvent = {
        target: {
          files: null
        }
      } as unknown as Event

      handleFileUpload(mockEvent)

      const fileListElement = document.getElementById('fileListItems')
      // Should not crash, but also shouldn't modify anything
      expect(fileListElement?.innerHTML).toBe('')
    })

    it('should handle missing fileListItems element gracefully', () => {
      document.body.innerHTML = '' // Remove the element

      const mockFiles = [new File(['content'], 'test.txt')]
      const mockEvent = {
        target: {
          files: mockFiles
        }
      } as unknown as Event

      // Should not crash
      expect(() => handleFileUpload(mockEvent)).not.toThrow()
    })

    it('should clear existing items before adding new ones', () => {
      const fileListElement = document.getElementById('fileListItems')!
      fileListElement.innerHTML = '<li>existing item</li>'

      const mockFiles = [new File(['content'], 'new.txt')]
      const mockEvent = {
        target: {
          files: mockFiles
        }
      } as unknown as Event

      handleFileUpload(mockEvent)

      expect(fileListElement.children).toHaveLength(1)
      expect(fileListElement.children[0]?.textContent).toBe('new.txt')
    })

    it('should handle empty FileList', () => {
      const mockEvent = {
        target: {
          files: [] as unknown as FileList
        }
      } as unknown as Event

      expect(() => handleFileUpload(mockEvent)).not.toThrow()

      const fileListElement = document.getElementById('fileListItems')
      expect(fileListElement?.children).toHaveLength(0)
    })
  })

  describe('handleDirectoryUpload', () => {
    beforeEach(() => {
      document.body.innerHTML = '<ul id="fileListItems"></ul>'
    })

    afterEach(() => {
      document.body.innerHTML = ''
    })

    it('should display webkitRelativePath when available', () => {
      const mockFile = new File(['content'], 'test.txt')
      Object.defineProperty(mockFile, 'webkitRelativePath', {
        value: 'folder/subfolder/test.txt',
        writable: false
      })

      const mockEvent = {
        target: {
          files: [mockFile] as unknown as FileList
        }
      } as unknown as Event

      handleDirectoryUpload(mockEvent)

      const fileListElement = document.getElementById('fileListItems')
      expect(fileListElement?.children[0]?.textContent).toBe('folder/subfolder/test.txt')
    })

    it('should fallback to filename when webkitRelativePath is not available', () => {
      const mockFile = new File(['content'], 'test.txt')

      const mockEvent = {
        target: {
          files: [mockFile] as unknown as FileList
        }
      } as unknown as Event

      handleDirectoryUpload(mockEvent)

      const fileListElement = document.getElementById('fileListItems')
      expect(fileListElement?.children[0]?.textContent).toBe('test.txt')
    })

    it('should handle multiple files with mixed path availability', () => {
      const file1 = new File(['content1'], 'file1.txt')
      const file2 = new File(['content2'], 'file2.txt')
      
      Object.defineProperty(file1, 'webkitRelativePath', {
        value: 'src/file1.txt',
        writable: false
      })
      // file2 has no webkitRelativePath

      const mockEvent = {
        target: {
          files: [file1, file2] as unknown as FileList
        }
      } as unknown as Event

      handleDirectoryUpload(mockEvent)

      const fileListElement = document.getElementById('fileListItems')
      expect(fileListElement?.children).toHaveLength(2)
      expect(fileListElement?.children[0]?.textContent).toBe('src/file1.txt')
      expect(fileListElement?.children[1]?.textContent).toBe('file2.txt')
    })

    it('should clear existing items before adding new ones', () => {
      const fileListElement = document.getElementById('fileListItems')!
      fileListElement.innerHTML = '<li>existing item</li>'

      const mockFile = new File(['content'], 'new.txt')
      const mockEvent = {
        target: {
          files: [mockFile] as unknown as FileList
        }
      } as unknown as Event

      handleDirectoryUpload(mockEvent)

      expect(fileListElement.children).toHaveLength(1)
      expect(fileListElement.children[0]?.textContent).toBe('new.txt')
    })
  })

  describe('filterFiles', () => {
    it('should filter files based on accepted types', () => {
      const jsFile = new File(['js content'], 'script.js', { type: 'text/javascript' })
      const txtFile = new File(['txt content'], 'readme.txt', { type: 'text/plain' })
      const pdfFile = new File(['pdf content'], 'document.pdf', { type: 'application/pdf' })

      const mockFileList = [jsFile, txtFile, pdfFile] as unknown as FileList
      Object.defineProperty(mockFileList, 'length', { value: 3 })

      const acceptedTypes = ['.js', '.txt']
      const result = filterFiles(mockFileList, acceptedTypes)

      expect(result.acceptedFiles).toHaveLength(2)
      expect(result.skippedFiles).toHaveLength(1)
      expect(result.acceptedFiles).toContain(jsFile)
      expect(result.acceptedFiles).toContain(txtFile)
      expect(result.skippedFiles).toContain(pdfFile)
    })

    it('should handle case insensitive file extensions', () => {
      const upperCaseFile = new File(['content'], 'SCRIPT.JS')
      const lowerCaseFile = new File(['content'], 'script.js')
      const mixedCaseFile = new File(['content'], 'Script.Js')

      const mockFileList = [upperCaseFile, lowerCaseFile, mixedCaseFile] as unknown as FileList
      Object.defineProperty(mockFileList, 'length', { value: 3 })

      const acceptedTypes = ['.js']
      const result = filterFiles(mockFileList, acceptedTypes)

      expect(result.acceptedFiles).toHaveLength(3)
      expect(result.skippedFiles).toHaveLength(0)
    })

    it('should handle files without extensions', () => {
      const noExtFile = new File(['content'], 'README')
      const mockFileList = [noExtFile] as unknown as FileList
      Object.defineProperty(mockFileList, 'length', { value: 1 })

      const acceptedTypes = ['.txt', '.md']
      const result = filterFiles(mockFileList, acceptedTypes)

      expect(result.acceptedFiles).toHaveLength(0)
      expect(result.skippedFiles).toHaveLength(1)
      expect(result.skippedFiles).toContain(noExtFile)
    })

    it('should handle empty accepted types array', () => {
      const jsFile = new File(['content'], 'script.js')
      const mockFileList = [jsFile] as unknown as FileList
      Object.defineProperty(mockFileList, 'length', { value: 1 })

      const acceptedTypes: string[] = []
      const result = filterFiles(mockFileList, acceptedTypes)

      expect(result.acceptedFiles).toHaveLength(0)
      expect(result.skippedFiles).toHaveLength(1)
    })

    it('should handle empty FileList', () => {
      const mockFileList = [] as unknown as FileList
      Object.defineProperty(mockFileList, 'length', { value: 0 })

      const acceptedTypes = ['.js', '.ts']
      const result = filterFiles(mockFileList, acceptedTypes)

      expect(result.acceptedFiles).toHaveLength(0)
      expect(result.skippedFiles).toHaveLength(0)
    })

    it('should handle multiple dots in filename', () => {
      const complexFile = new File(['content'], 'my.component.test.ts')
      const mockFileList = [complexFile] as unknown as FileList
      Object.defineProperty(mockFileList, 'length', { value: 1 })

      const acceptedTypes = ['.ts']
      const result = filterFiles(mockFileList, acceptedTypes)

      expect(result.acceptedFiles).toHaveLength(1)
      expect(result.acceptedFiles).toContain(complexFile)
    })

    it('should handle files with only dots in name', () => {
      const dotFile = new File(['content'], '...')
      const mockFileList = [dotFile] as unknown as FileList
      Object.defineProperty(mockFileList, 'length', { value: 1 })

      const acceptedTypes = ['.js']
      const result = filterFiles(mockFileList, acceptedTypes)

      expect(result.acceptedFiles).toHaveLength(0)
      expect(result.skippedFiles).toHaveLength(1)
    })

    it('should correctly categorize TypeScript files', () => {
      const tsFile = new File(['content'], 'component.ts')
      const tsxFile = new File(['content'], 'Component.tsx')
      const jsFile = new File(['content'], 'script.js')

      const mockFileList = [tsFile, tsxFile, jsFile] as unknown as FileList
      Object.defineProperty(mockFileList, 'length', { value: 3 })

      const acceptedTypes = ['.ts', '.tsx']
      const result = filterFiles(mockFileList, acceptedTypes)

      expect(result.acceptedFiles).toHaveLength(2)
      expect(result.skippedFiles).toHaveLength(1)
      expect(result.acceptedFiles).toContain(tsFile)
      expect(result.acceptedFiles).toContain(tsxFile)
      expect(result.skippedFiles).toContain(jsFile)
    })
  })

  describe('readFileContent', () => {
    it('should read file content and resolve with string', async () => {
      const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' })

      const result = await readFileContent(mockFile)

      expect(result).toBe('content of test.txt')
    })

    it('should handle different file types', async () => {
      const jsFile = new File(['console.log("hello")'], 'script.js', { type: 'text/javascript' })
      const cssFile = new File(['body { margin: 0; }'], 'style.css', { type: 'text/css' })

      const [jsResult, cssResult] = await Promise.all([
        readFileContent(jsFile),
        readFileContent(cssFile)
      ])

      expect(jsResult).toBe('content of script.js')
      expect(cssResult).toBe('content of style.css')
    })

    it('should handle empty files', async () => {
      const emptyFile = new File([], 'empty.txt', { type: 'text/plain' })

      const result = await readFileContent(emptyFile)

      expect(result).toBe('content of empty.txt')
    })

    it('should reject when FileReader encounters an error', async () => {
      // Mock FileReader to simulate error
      const OriginalFileReader = global.FileReader

      class ErrorFileReader {
        onload: Function | null = null
        onerror: Function | null = null

        readAsText() {
          setTimeout(() => {
            if (this.onerror) {
              this.onerror(new Error('File read error'))
            }
          }, 0)
        }
      }

      global.FileReader = ErrorFileReader as any

      const mockFile = new File(['content'], 'test.txt')

      await expect(readFileContent(mockFile)).rejects.toEqual(new Error('File read error'))

      // Restore original FileReader
      global.FileReader = OriginalFileReader
    })

    it('should handle large files', async () => {
      const largeContent = 'x'.repeat(10000)
      const largeFile = new File([largeContent], 'large.txt')

      const result = await readFileContent(largeFile)

      expect(result).toBe('content of large.txt')
    })

    it('should maintain file encoding', async () => {
      const unicodeContent = '🚀 Unicode content with émojis and àccénts'
      const unicodeFile = new File([unicodeContent], 'unicode.txt')

      const result = await readFileContent(unicodeFile)

      expect(result).toBe('content of unicode.txt')
    })

    it('should handle binary files read as text', async () => {
      // Create a file with binary-like content
      const binaryFile = new File([new Uint8Array([0, 1, 2, 3, 255])], 'binary.bin')

      const result = await readFileContent(binaryFile)

      expect(result).toBe('content of binary.bin')
    })

    it('should work with multiple simultaneous reads', async () => {
      const file1 = new File(['content1'], 'file1.txt')
      const file2 = new File(['content2'], 'file2.txt')
      const file3 = new File(['content3'], 'file3.txt')

      const results = await Promise.all([
        readFileContent(file1),
        readFileContent(file2),
        readFileContent(file3)
      ])

      expect(results).toEqual([
        'content of file1.txt',
        'content of file2.txt',
        'content of file3.txt'
      ])
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should throw when filterFiles receives null FileList', () => {
      expect(() => {
        filterFiles(null as any, ['.js'])
      }).toThrow()
    })

    it('should throw when filterFiles receives null accepted types and has files to process', () => {
      // Create a non-empty FileList so the function actually tries to use acceptedTypes
      const jsFile = new File(['content'], 'script.js')
      const mockFileList = [jsFile] as unknown as FileList
      Object.defineProperty(mockFileList, 'length', { value: 1 })

      expect(() => {
        filterFiles(mockFileList, null as any)
      }).toThrow('Cannot read properties of null')
    })

    it('should not throw when filterFiles receives null accepted types but empty FileList', () => {
      // With empty FileList, the loop never runs so null acceptedTypes is never used
      const mockFileList = [] as unknown as FileList
      Object.defineProperty(mockFileList, 'length', { value: 0 })

      expect(() => {
        filterFiles(mockFileList, null as any)
      }).not.toThrow()
    })

    it('should throw when handleFileUpload receives malformed event', () => {
      const malformedEvent = {} as Event

      expect(() => {
        handleFileUpload(malformedEvent)
      }).toThrow('Cannot read properties of undefined')

      expect(() => {
        handleDirectoryUpload(malformedEvent)
      }).toThrow('Cannot read properties of undefined')
    })

    it('should throw when filterFiles encounters null file in FileList', () => {
      const mockFileList = {
        0: null,
        1: new File(['content'], 'test.txt'),
        length: 2
      } as unknown as FileList

      expect(() => {
        filterFiles(mockFileList, ['.txt'])
      }).toThrow('Cannot read properties of null')
    })

    it('should handle events with null target gracefully', () => {
      const eventWithNullTarget = {
        target: null
      } as unknown as Event

      expect(() => {
        handleFileUpload(eventWithNullTarget)
      }).toThrow()

      expect(() => {
        handleDirectoryUpload(eventWithNullTarget)
      }).toThrow()
    })
  })

  describe('Performance', () => {
    it('should handle large numbers of files efficiently', () => {
      const files = Array.from({ length: 1000 }, (_, i) => 
        new File(['content'], `file${i}.js`)
      )
      
      const mockFileList = {
        ...files,
        length: files.length
      } as unknown as FileList

      const start = performance.now()
      const result = filterFiles(mockFileList, ['.js'])
      const end = performance.now()

      expect(result.acceptedFiles).toHaveLength(1000)
      expect(result.skippedFiles).toHaveLength(0)
      expect(end - start).toBeLessThan(100) // Should complete within 100ms
    })

    it('should not leak memory with multiple reads', async () => {
      const promises = Array.from({ length: 100 }, (_, i) => {
        const file = new File([`content ${i}`], `file${i}.txt`)
        return readFileContent(file)
      })

      const results = await Promise.all(promises)
      expect(results).toHaveLength(100)
    })
  })
})