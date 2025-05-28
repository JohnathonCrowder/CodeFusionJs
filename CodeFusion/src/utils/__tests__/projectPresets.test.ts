import { describe, it, expect } from 'vitest'
import { 
  projectPresets, 
  getPreset, 
  getAvailablePresets, 
  getPresetMetadata 
} from '../projectPresets'

describe('projectPresets', () => {
  describe('projectPresets object', () => {
    it('should contain all expected preset keys', () => {
      const expectedPresets = [
        'react', 'python', 'custom', 'vue', 'svelte', 
        'nextjs', 'django', 'rust', 'go'
      ]
      
      expect(Object.keys(projectPresets)).toEqual(expect.arrayContaining(expectedPresets))
      expect(Object.keys(projectPresets)).toHaveLength(expectedPresets.length)
    })

    it('should have consistent structure for all presets', () => {
      Object.entries(projectPresets).forEach(([key, preset]) => {
        expect(preset).toHaveProperty('autoUnselectFolders')
        expect(preset).toHaveProperty('acceptedTypes')
        expect(Array.isArray(preset.autoUnselectFolders)).toBe(true)
        expect(Array.isArray(preset.acceptedTypes)).toBe(true)
        expect(preset.autoUnselectFolders.length).toBeGreaterThan(0)
        expect(preset.acceptedTypes.length).toBeGreaterThan(0)
      })
    })

    it('should have string arrays for all preset properties', () => {
      Object.entries(projectPresets).forEach(([key, preset]) => {
        preset.autoUnselectFolders.forEach(folder => {
          expect(typeof folder).toBe('string')
          expect(folder.length).toBeGreaterThan(0)
        })
        
        preset.acceptedTypes.forEach(type => {
          expect(typeof type).toBe('string')
          expect(type.length).toBeGreaterThan(0)
          
          // Validate that accepted types are either file extensions or known special files
          const specialFiles = [
            // Package managers
            'package.json', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
            'Pipfile', 'Pipfile.lock', 'Cargo.toml', 'Cargo.lock',
            
            // Build/Deploy
            'Dockerfile', 'Makefile', 'Procfile',
            
            // Python
            'requirements.txt', 'requirements-dev.txt', 'requirements-test.txt',
            'dev-requirements.txt', 'setup.py', 'setup.cfg', 'manage.py', 
            'wsgi.py', 'asgi.py', 'conftest.py', 'pytest.ini', 'tox.ini', 
            '.coveragerc', '.flake8', '.pylintrc', 'pycodestyle.cfg', 
            'mypy.ini', '.isort.cfg', '.black', '.pre-commit-config.yaml',
            'runtime.txt', 'settings.py', 'urls.py', 'models.py', 'views.py',
            'app.py', 'run.py', 'main.py', 'api.py',
            
            // Deployment
            'netlify.toml', 'vercel.json',
            
            // Config files without extensions
            'tsconfig.json', 'jsconfig.json'
          ]
          
          if (!specialFiles.includes(type)) {
            // Should be a file extension (starts with dot) or config pattern
            expect(type).toMatch(/^\.|\..*$/)
          }
        })
      })
    })
  })

  describe('specific preset configurations', () => {
    describe('react preset', () => {
      it('should include React-specific folders to exclude', () => {
        const react = projectPresets.react
        
        expect(react.autoUnselectFolders).toContain('node_modules')
        expect(react.autoUnselectFolders).toContain('.next')
        expect(react.autoUnselectFolders).toContain('build')
        expect(react.autoUnselectFolders).toContain('dist')
        expect(react.autoUnselectFolders).toContain('.git')
        expect(react.autoUnselectFolders).toContain('coverage')
      })

      it('should include React-specific file types', () => {
        const react = projectPresets.react
        
        expect(react.acceptedTypes).toContain('.js')
        expect(react.acceptedTypes).toContain('.jsx')
        expect(react.acceptedTypes).toContain('.ts')
        expect(react.acceptedTypes).toContain('.tsx')
        expect(react.acceptedTypes).toContain('.css')
        expect(react.acceptedTypes).toContain('.scss')
        expect(react.acceptedTypes).toContain('package.json')
        expect(react.acceptedTypes).toContain('.json')
      })

      it('should include modern React tooling files', () => {
        const react = projectPresets.react
        
        expect(react.acceptedTypes).toContain('vite.config.js')
        expect(react.acceptedTypes).toContain('next.config.js')
        expect(react.acceptedTypes).toContain('tailwind.config.js')
      })
    })

    describe('python preset', () => {
      it('should include Python-specific folders to exclude', () => {
        const python = projectPresets.python
        
        expect(python.autoUnselectFolders).toContain('venv')
        expect(python.autoUnselectFolders).toContain('.venv')
        expect(python.autoUnselectFolders).toContain('__pycache__')
        expect(python.autoUnselectFolders).toContain('.pytest_cache')
        expect(python.autoUnselectFolders).toContain('build')
        expect(python.autoUnselectFolders).toContain('dist')
      })

      it('should include Python-specific file types', () => {
        const python = projectPresets.python
        
        expect(python.acceptedTypes).toContain('.py')
        expect(python.acceptedTypes).toContain('.pyi')
        expect(python.acceptedTypes).toContain('requirements.txt')
        expect(python.acceptedTypes).toContain('setup.py')
        expect(python.acceptedTypes).toContain('.yml')
        expect(python.acceptedTypes).toContain('.yaml')
      })

      it('should include Django-specific files', () => {
        const python = projectPresets.python
        
        expect(python.acceptedTypes).toContain('manage.py')
        expect(python.acceptedTypes).toContain('settings.py')
        expect(python.acceptedTypes).toContain('urls.py')
      })

      it('should include Pipenv files', () => {
        const python = projectPresets.python
        
        expect(python.acceptedTypes).toContain('Pipfile')
        expect(python.acceptedTypes).toContain('Pipfile.lock')
      })
    })

    describe('custom preset', () => {
      it('should have minimal excluded folders', () => {
        const custom = projectPresets.custom
        
        expect(custom.autoUnselectFolders).toContain('.git')
        expect(custom.autoUnselectFolders).toContain('node_modules')
        expect(custom.autoUnselectFolders.length).toBeLessThanOrEqual(10) // Should be minimal
      })

      it('should have core file types', () => {
        const custom = projectPresets.custom
        
        expect(custom.acceptedTypes).toContain('.html')
        expect(custom.acceptedTypes).toContain('.css')
        expect(custom.acceptedTypes).toContain('.js')
        expect(custom.acceptedTypes).toContain('.json')
        expect(custom.acceptedTypes).toContain('.md')
      })
    })

    describe('nextjs preset', () => {
      it('should include Next.js specific exclusions', () => {
        const nextjs = projectPresets.nextjs
        
        expect(nextjs.autoUnselectFolders).toContain('.next')
        expect(nextjs.autoUnselectFolders).toContain('out')
        expect(nextjs.autoUnselectFolders).toContain('.turbo')
      })

      it('should include Next.js specific file types', () => {
        const nextjs = projectPresets.nextjs
        
        expect(nextjs.acceptedTypes).toContain('next.config.js')
        expect(nextjs.acceptedTypes).toContain('next.config.mjs')
        expect(nextjs.acceptedTypes).toContain('.mdx')
      })
    })

    describe('vue preset', () => {
      it('should include Vue-specific exclusions', () => {
        const vue = projectPresets.vue
        
        expect(vue.autoUnselectFolders).toContain('.nuxt')
        expect(vue.autoUnselectFolders).toContain('.output')
      })

      it('should include Vue-specific file types', () => {
        const vue = projectPresets.vue
        
        expect(vue.acceptedTypes).toContain('.vue')
        expect(vue.acceptedTypes).toContain('vue.config.js')
        expect(vue.acceptedTypes).toContain('nuxt.config.js')
      })
    })

    describe('rust preset', () => {
      it('should include Rust-specific exclusions', () => {
        const rust = projectPresets.rust
        
        expect(rust.autoUnselectFolders).toContain('target')
      })

      it('should include Rust-specific file types', () => {
        const rust = projectPresets.rust
        
        expect(rust.acceptedTypes).toContain('.rs')
        expect(rust.acceptedTypes).toContain('.toml')
        expect(rust.acceptedTypes).toContain('Cargo.toml')
        expect(rust.acceptedTypes).toContain('Cargo.lock')
      })
    })

    describe('go preset', () => {
      it('should include Go-specific exclusions', () => {
        const go = projectPresets.go
        
        expect(go.autoUnselectFolders).toContain('vendor')
        expect(go.autoUnselectFolders).toContain('bin')
      })

      it('should include Go-specific file types', () => {
        const go = projectPresets.go
        
        expect(go.acceptedTypes).toContain('.go')
        expect(go.acceptedTypes).toContain('.mod')
        expect(go.acceptedTypes).toContain('.sum')
      })
    })

    describe('django preset', () => {
      it('should include Django-specific exclusions', () => {
        const django = projectPresets.django
        
        expect(django.autoUnselectFolders).toContain('staticfiles')
        expect(django.autoUnselectFolders).toContain('media')
      })

      it('should include Django-specific file types', () => {
        const django = projectPresets.django
        
        expect(django.acceptedTypes).toContain('manage.py')
        expect(django.acceptedTypes).toContain('models.py')
        expect(django.acceptedTypes).toContain('views.py')
      })
    })

    describe('svelte preset', () => {
      it('should include Svelte-specific exclusions', () => {
        const svelte = projectPresets.svelte
        
        expect(svelte.autoUnselectFolders).toContain('.svelte-kit')
      })

      it('should include Svelte-specific file types', () => {
        const svelte = projectPresets.svelte
        
        expect(svelte.acceptedTypes).toContain('.svelte')
        expect(svelte.acceptedTypes).toContain('svelte.config.js')
      })
    })
  })

  describe('getPreset function', () => {
    it('should return correct preset when valid name is provided', () => {
      const reactPreset = getPreset('react')
      expect(reactPreset).toBe(projectPresets.react)
      expect(reactPreset.acceptedTypes).toContain('.jsx')

      const pythonPreset = getPreset('python')
      expect(pythonPreset).toBe(projectPresets.python)
      expect(pythonPreset.acceptedTypes).toContain('.py')
    })

    it('should return custom preset for invalid preset names', () => {
      const invalidPreset = getPreset('nonexistent')
      expect(invalidPreset).toBe(projectPresets.custom)

      const emptyStringPreset = getPreset('')
      expect(emptyStringPreset).toBe(projectPresets.custom)

      const nullPreset = getPreset(null as any)
      expect(nullPreset).toBe(projectPresets.custom)

      const undefinedPreset = getPreset(undefined as any)
      expect(undefinedPreset).toBe(projectPresets.custom)
    })

    it('should handle all valid preset names', () => {
      const validPresets = Object.keys(projectPresets)
      
      validPresets.forEach(presetName => {
        const preset = getPreset(presetName)
        expect(preset).toBe(projectPresets[presetName as keyof typeof projectPresets])
      })
    })

    it('should be case sensitive', () => {
      const upperCasePreset = getPreset('REACT')
      expect(upperCasePreset).toBe(projectPresets.custom) // Should fallback

      const mixedCasePreset = getPreset('React')
      expect(mixedCasePreset).toBe(projectPresets.custom) // Should fallback
    })
  })

  describe('getAvailablePresets function', () => {
    it('should return all preset names', () => {
      const availablePresets = getAvailablePresets()
      const expectedPresets = Object.keys(projectPresets)
      
      expect(availablePresets).toEqual(expect.arrayContaining(expectedPresets))
      expect(availablePresets).toHaveLength(expectedPresets.length)
    })

    it('should return an array of strings', () => {
      const availablePresets = getAvailablePresets()
      
      expect(Array.isArray(availablePresets)).toBe(true)
      availablePresets.forEach(preset => {
        expect(typeof preset).toBe('string')
        expect(preset.length).toBeGreaterThan(0)
      })
    })

    it('should include all expected presets', () => {
      const availablePresets = getAvailablePresets()
      
      expect(availablePresets).toContain('react')
      expect(availablePresets).toContain('python')
      expect(availablePresets).toContain('custom')
      expect(availablePresets).toContain('vue')
      expect(availablePresets).toContain('svelte')
      expect(availablePresets).toContain('nextjs')
      expect(availablePresets).toContain('django')
      expect(availablePresets).toContain('rust')
      expect(availablePresets).toContain('go')
    })

    it('should not have duplicate entries', () => {
      const availablePresets = getAvailablePresets()
      const uniquePresets = [...new Set(availablePresets)]
      
      expect(availablePresets).toHaveLength(uniquePresets.length)
    })
  })

  describe('getPresetMetadata function', () => {
    it('should return metadata for all presets', () => {
      const metadata = getPresetMetadata()
      const presetKeys = Object.keys(projectPresets)
      
      presetKeys.forEach(key => {
        expect(metadata).toHaveProperty(key)
        expect(metadata[key as keyof typeof metadata]).toHaveProperty('name')
        expect(metadata[key as keyof typeof metadata]).toHaveProperty('description')
        expect(metadata[key as keyof typeof metadata]).toHaveProperty('icon')
        expect(metadata[key as keyof typeof metadata]).toHaveProperty('color')
      })
    })

    it('should have correct metadata structure for each preset', () => {
      const metadata = getPresetMetadata()
      
      Object.values(metadata).forEach(presetMeta => {
        expect(typeof presetMeta.name).toBe('string')
        expect(typeof presetMeta.description).toBe('string')
        expect(typeof presetMeta.icon).toBe('string')
        expect(typeof presetMeta.color).toBe('string')
        expect(presetMeta.name.length).toBeGreaterThan(0)
        expect(presetMeta.description.length).toBeGreaterThan(0)
        expect(presetMeta.icon.length).toBeGreaterThan(0)
        expect(presetMeta.color.length).toBeGreaterThan(0)
      })
    })

    it('should have specific metadata for known presets', () => {
      const metadata = getPresetMetadata()
      
      expect(metadata.react.name).toBe('React / Next.js')
      expect(metadata.react.description).toContain('React and Next.js')
      expect(metadata.react.icon).toBe('⚛️')
      expect(metadata.react.color).toBe('blue')

      expect(metadata.python.name).toBe('Python')
      expect(metadata.python.description).toContain('Python applications')
      expect(metadata.python.icon).toBe('🐍')
      expect(metadata.python.color).toBe('green')

      expect(metadata.custom.name).toBe('Custom')
      expect(metadata.custom.description).toContain('customizable')
      expect(metadata.custom.icon).toBe('⚙️')
      expect(metadata.custom.color).toBe('gray')
    })

    it('should have valid color values', () => {
      const metadata = getPresetMetadata()
      const validColors = ['blue', 'green', 'orange', 'purple', 'red', 'yellow', 'gray', 'black', 'indigo']
      
      Object.values(metadata).forEach(presetMeta => {
        expect(validColors).toContain(presetMeta.color)
      })
    })

    it('should have emoji icons for visual presets', () => {
      const metadata = getPresetMetadata()
      
      // Most presets should have emoji icons (Unicode characters)
      expect(metadata.react.icon).toMatch(/[\u{1F300}-\u{1F9FF}]|⚛️|▲|🔥|🎸|🦀|🐹|⚙️/u)
      expect(metadata.python.icon).toBe('🐍')
      expect(metadata.vue.icon).toBe('🟢')
      expect(metadata.svelte.icon).toBe('🔥')
    })

    it('should return the same object on multiple calls', () => {
      const metadata1 = getPresetMetadata()
      const metadata2 = getPresetMetadata()
      
      expect(metadata1).toEqual(metadata2)
      expect(Object.keys(metadata1)).toEqual(Object.keys(metadata2))
    })
  })

  describe('cross-preset consistency', () => {
    it('should have common folders excluded across relevant presets', () => {
      const webPresets = ['react', 'vue', 'svelte', 'nextjs']
      
      webPresets.forEach(presetName => {
        const preset = projectPresets[presetName as keyof typeof projectPresets]
        expect(preset.autoUnselectFolders).toContain('node_modules')
        expect(preset.autoUnselectFolders).toContain('.git')
        expect(preset.autoUnselectFolders).toContain('coverage')
      })
    })

    it('should have common file types across related presets', () => {
      const webPresets = ['react', 'vue', 'svelte', 'nextjs']
      
      webPresets.forEach(presetName => {
        const preset = projectPresets[presetName as keyof typeof projectPresets]
        expect(preset.acceptedTypes).toContain('.js')
        expect(preset.acceptedTypes).toContain('.ts')
        expect(preset.acceptedTypes).toContain('.css')
        expect(preset.acceptedTypes).toContain('.json')
      })
    })

    it('should not have major conflicting exclusions', () => {
      Object.entries(projectPresets).forEach(([key, preset]) => {
        // No preset should exclude basic version control
        expect(preset.autoUnselectFolders).toContain('.git')
        
        // Check for obvious conflicts between file types and folder exclusions
        // Note: .env can be both a file extension and a folder name, so we allow this
        preset.acceptedTypes.forEach(type => {
          if (type.startsWith('.') && type !== '.env' && type !== '.lock') {
            // Only check for clear conflicts where the type and folder name would be identical
            const potentialConflicts = preset.autoUnselectFolders.filter(folder => 
              folder === type || (folder.startsWith('.') && folder === type)
            )
            // Allow reasonable exceptions like .env which can be both file and folder
            const allowedConflicts = ['.env', '.cache', '.tmp']
            potentialConflicts.forEach(conflict => {
              if (!allowedConflicts.includes(conflict)) {
                expect(preset.autoUnselectFolders).not.toContain(type)
              }
            })
          }
        })
      })
    })

    it('should have reasonable sizes for arrays', () => {
      Object.entries(projectPresets).forEach(([key, preset]) => {
        // Each preset should have a reasonable number of exclusions
        expect(preset.autoUnselectFolders.length).toBeGreaterThan(3)
        expect(preset.autoUnselectFolders.length).toBeLessThan(60) // Increased to accommodate Python preset
        
        // Each preset should accept a reasonable number of file types
        expect(preset.acceptedTypes.length).toBeGreaterThan(5)
        expect(preset.acceptedTypes.length).toBeLessThan(100)
      })
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle Object.keys safely', () => {
      expect(() => Object.keys(projectPresets)).not.toThrow()
      expect(() => getAvailablePresets()).not.toThrow()
    })

    it('should handle preset access safely', () => {
      const keys = Object.keys(projectPresets)
      
      keys.forEach(key => {
        expect(() => projectPresets[key as keyof typeof projectPresets]).not.toThrow()
      })
    })

    it('should handle metadata access safely', () => {
      expect(() => getPresetMetadata()).not.toThrow()
      
      const metadata = getPresetMetadata()
      Object.keys(metadata).forEach(key => {
        expect(() => metadata[key as keyof typeof metadata]).not.toThrow()
      })
    })
  })

  describe('type safety', () => {
    it('should maintain type consistency for preset keys', () => {
      const presets = getAvailablePresets()
      
      presets.forEach(presetName => {
        // This should not cause TypeScript errors when used as keys
        const preset = projectPresets[presetName as keyof typeof projectPresets]
        expect(preset).toBeDefined()
      })
    })

    it('should have consistent property types across presets', () => {
      Object.values(projectPresets).forEach(preset => {
        // All presets should have the same structure
        expect(typeof preset).toBe('object')
        expect(Array.isArray(preset.autoUnselectFolders)).toBe(true)
        expect(Array.isArray(preset.acceptedTypes)).toBe(true)
        
        // All array elements should be strings
        preset.autoUnselectFolders.forEach(folder => {
          expect(typeof folder).toBe('string')
        })
        preset.acceptedTypes.forEach(type => {
          expect(typeof type).toBe('string')
        })
      })
    })
  })
})