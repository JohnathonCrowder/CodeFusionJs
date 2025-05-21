export const projectPresets = {
  react: {
    autoUnselectFolders: [
      // Node.js & Package Managers
      'node_modules', '@types',
      
      // Build Output
      'build', 'dist', 'out', '.next', 'public/build',
      
      // Development Servers & Hot Reload
      '.next', '.nuxt', '.turbo', '.parcel-cache',
      
      // Testing & Coverage
      'coverage', '.nyc_output', 'jest_coverage',
      
      // Mobile Development (React Native/Expo)
      '.expo', '.expo-shared', 'ios', 'android',
      
      // Storybook
      'storybook-static', '.storybook/dist',
      
      // Version Control
      '.git', '.svn',
      
      // IDEs & Editors
      '.vscode', '.idea', '.vs',
      
      // OS Files
      '.DS_Store', 'Thumbs.db',
      
      // Temporary & Cache
      'tmp', 'temp', '.cache', '.sass-cache', '.eslintcache',
      
      // Logs
      'logs', 'log', '*.log', 'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*'
    ],
    acceptedTypes: [
      // Core React/JavaScript
      '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs',
      
      // Styles
      '.css', '.scss', '.sass', '.less', '.styl', '.module.css', '.module.scss',
      
      // Configuration
      '.json', '.jsonc', '.json5',
      '.env', '.env.local', '.env.development', '.env.production', '.env.staging',
      '.gitignore', '.gitattributes',
      
      // Package Management
      'package.json', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
      
      // Build & Bundling
      'webpack.config.js', 'vite.config.js', 'vite.config.ts', 
      'rollup.config.js', 'esbuild.config.js',
      'next.config.js', 'next.config.mjs',
      'craco.config.js', 'vue.config.js',
      
      // TypeScript
      'tsconfig.json', 'tsconfig.*.json', 'jsconfig.json',
      
      // Linting & Formatting
      '.eslintrc', '.eslintrc.json', '.eslintrc.js', '.eslintrc.cjs',
      '.prettierrc', '.prettierrc.json', '.prettierrc.js',
      '.stylelintrc', '.stylelintrc.json',
      
      // Testing
      'jest.config.js', 'jest.config.ts', 'jest.setup.js',
      'vitest.config.js', 'vitest.config.ts',
      '.test.js', '.test.ts', '.test.jsx', '.test.tsx',
      '.spec.js', '.spec.ts', '.spec.jsx', '.spec.tsx',
      
      // Documentation
      '.md', '.mdx', '.txt',
      
      // API & Data
      '.graphql', '.gql', '.json',
      
      // Assets (selective)
      '.svg', '.ico',
      
      // Deployment & CI/CD
      '.yml', '.yaml', 'Dockerfile', '.dockerignore',
      'vercel.json', 'netlify.toml',
      
      // Storybook
      '.stories.js', '.stories.ts', '.stories.jsx', '.stories.tsx',
      
      // Tailwind & PostCSS
      'tailwind.config.js', 'tailwind.config.ts', 'postcss.config.js'
    ]
  },
  
  python: {
    autoUnselectFolders: [
      // Virtual Environments
      'venv', '.venv', 'env', '.env', 'ENV', '.ENV',
      'virtualenv', '.virtualenv',
      
      // Python Cache
      '__pycache__', '*.pyc', '*.pyo', '*.pyd',
      
      // Testing
      '.pytest_cache', '.tox', '.nox', '.coverage',
      'htmlcov', 'coverage.xml', '.cache',
      
      // Build & Distribution
      'build', 'dist', '*.egg-info', '.eggs',
      'sdist', 'wheels',
      
      // IDEs & Editors
      '.vscode', '.idea', '.vs', '.spyderproject', '.spyproject',
      
      // Jupyter
      '.ipynb_checkpoints',
      
      // Documentation
      'docs/_build', '_build', '.sphinx',
      
      // Version Control
      '.git', '.svn', '.hg',
      
      // OS Files
      '.DS_Store', 'Thumbs.db',
      
      // Logs & Temporary
      'logs', 'log', '*.log', 'tmp', 'temp',
      
      // Database
      '*.db', '*.sqlite', '*.sqlite3',
      
      // Cloud Functions
      '.serverless', '.aws-sam',
      
      // Poetry
      'poetry.lock'
    ],
    acceptedTypes: [
      // Python Files
      '.py', '.pyi', '.pyw', '.pyx', '.pxd',
      
      // Configuration
      '.cfg', '.conf', '.ini', '.toml', '.yaml', '.yml', '.json',
      
      // Environment
      '.env', '.env.local', '.env.development', '.env.production',
      
      // Requirements & Dependencies
      'requirements.txt', 'requirements-*.txt', 'dev-requirements.txt',
      'Pipfile', 'Pipfile.lock', 'pyproject.toml', 'setup.py', 'setup.cfg',
      'poetry.lock', 'poetry.toml',
      
      // Documentation
      '.md', '.rst', '.txt',
      
      // Data Science & ML
      '.ipynb', '.csv', '.json', '.parquet', '.h5', '.hdf5',
      
      // Database
      '.sql', '.db', '.sqlite', '.sqlite3',
      
      // Templates
      '.html', '.htm', '.xml', '.jinja', '.jinja2', '.j2',
      
      // API & Serialization
      '.json', '.pickle', '.pkl', '.joblib',
      
      // Testing
      'conftest.py', 'pytest.ini', 'tox.ini', '.coveragerc',
      
      // Linting & Formatting
      '.flake8', '.pylintrc', 'pycodestyle.cfg', 'mypy.ini',
      '.isort.cfg', '.black', '.pre-commit-config.yaml',
      
      // Deployment & CI/CD
      'Dockerfile', '.dockerignore', '.yml', '.yaml',
      'runtime.txt', 'Procfile',
      
      // Version Control
      '.gitignore', '.gitattributes',
      
      // Scripts
      '.sh', '.bat', '.ps1', 'Makefile',
      
      // Django Specific
      'manage.py', 'wsgi.py', 'asgi.py', 'settings.py', 'urls.py',
      
      // Flask Specific
      'app.py', 'run.py', 'wsgi.py',
      
      // FastAPI/Starlette
      'main.py', 'api.py'
    ]
  },
  
  custom: {
    name: "Custom Configuration",
    description: "Fully customizable settings - uses global defaults",
    autoUnselectFolders: [
      // Minimal set of universally excluded folders
      '.git', 'node_modules', 'venv', '.venv', '__pycache__',
      'build', 'dist', '.cache', 'tmp', 'logs'
    ],
    acceptedTypes: [
      // Core web technologies
      '.html', '.css', '.js', '.ts', '.json',
      '.md', '.txt', '.yml', '.yaml', '.env', '.gitignore'
    ]
  },
  
  // Additional modern presets
  vue: {
    autoUnselectFolders: [
      'node_modules', 'dist', 'build', '.nuxt', '.output',
      '.cache', '.turbo', '.parcel-cache', 'coverage',
      '.git', '.vscode', '.idea', '.DS_Store', 'Thumbs.db',
      'logs', 'tmp', '.eslintcache'
    ],
    acceptedTypes: [
      '.vue', '.js', '.ts', '.jsx', '.tsx',
      '.css', '.scss', '.sass', '.less', '.styl',
      '.json', '.md', '.env', '.gitignore',
      'package.json', '.lock', '.yml', '.yaml',
      'vite.config.js', 'nuxt.config.js', 'vue.config.js'
    ]
  },
  
  svelte: {
    autoUnselectFolders: [
      'node_modules', 'build', '.svelte-kit', 'dist',
      '.cache', '.parcel-cache', 'coverage',
      '.git', '.vscode', '.idea', '.DS_Store',
      'logs', 'tmp'
    ],
    acceptedTypes: [
      '.svelte', '.js', '.ts', '.css', '.scss', '.sass',
      '.json', '.md', '.env', '.gitignore',
      'svelte.config.js', 'vite.config.js',
      'package.json', '.lock', '.yml'
    ]
  },
  
  nextjs: {
    autoUnselectFolders: [
      'node_modules', '.next', 'out', 'build', 'dist',
      '.turbo', '.cache', 'coverage',
      '.git', '.vscode', '.idea', '.DS_Store',
      'logs', 'tmp', '.eslintcache'
    ],
    acceptedTypes: [
      '.js', '.jsx', '.ts', '.tsx', '.mjs',
      '.css', '.scss', '.module.css', '.module.scss',
      '.json', '.md', '.mdx', '.env', '.env.local',
      'next.config.js', 'next.config.mjs',
      'tailwind.config.js', 'postcss.config.js',
      'package.json', '.lock', '.gitignore'
    ]
  },
  
  django: {
    autoUnselectFolders: [
      'venv', '.venv', '__pycache__', 'staticfiles',
      'media', '.pytest_cache', 'coverage',
      '.git', '.vscode', '.idea', '.DS_Store',
      'logs', 'tmp', '*.egg-info'
    ],
    acceptedTypes: [
      '.py', '.html', '.css', '.js', '.json',
      '.txt', '.md', '.yml', '.yaml', '.env',
      'requirements.txt', 'manage.py', 'wsgi.py',
      'settings.py', 'urls.py', 'models.py', 'views.py',
      '.gitignore', 'Dockerfile'
    ]
  },
  
  rust: {
    autoUnselectFolders: [
      'target', 'node_modules', '.git', '.vscode', '.idea',
      'coverage', 'logs', 'tmp', '.DS_Store'
    ],
    acceptedTypes: [
      '.rs', '.toml', '.lock', '.md', '.txt',
      'Cargo.toml', 'Cargo.lock', '.gitignore',
      '.yml', '.yaml', '.json'
    ]
  },
  
  go: {
    autoUnselectFolders: [
      'vendor', 'bin', '.git', '.vscode', '.idea',
      'coverage', 'logs', 'tmp', '.DS_Store'
    ],
    acceptedTypes: [
      '.go', '.mod', '.sum', '.md', '.txt', '.yml', '.yaml',
      '.json', '.gitignore', 'Dockerfile', 'Makefile'
    ]
  }
};

// Helper function to get preset by name with fallback
export const getPreset = (presetName: string) => {
  return projectPresets[presetName as keyof typeof projectPresets] || projectPresets.custom;
};

// Function to get all available preset names
export const getAvailablePresets = (): string[] => {
  return Object.keys(projectPresets);
};

// Function to get preset metadata
export const getPresetMetadata = () => {
  return {
    react: {
      name: "React / Next.js",
      description: "Optimized for React and Next.js projects",
      icon: "⚛️",
      color: "blue"
    },
    python: {
      name: "Python",
      description: "Python applications, Django, Flask, FastAPI",
      icon: "🐍", 
      color: "green"
    },
    vue: {
      name: "Vue.js",
      description: "Vue.js and Nuxt.js applications",
      icon: "🟢",
      color: "green"
    },
    svelte: {
      name: "Svelte / SvelteKit", 
      description: "Svelte and SvelteKit projects",
      icon: "🔥",
      color: "orange"
    },
    nextjs: {
      name: "Next.js",
      description: "Next.js specific optimizations",
      icon: "▲",
      color: "black"
    },
    django: {
      name: "Django",
      description: "Django web framework projects", 
      icon: "🎸",
      color: "green"
    },
    rust: {
      name: "Rust",
      description: "Rust projects with Cargo",
      icon: "🦀",
      color: "orange" 
    },
    go: {
      name: "Go",
      description: "Go applications and modules",
      icon: "🐹",
      color: "blue"
    },
    custom: {
      name: "Custom",
      description: "Fully customizable configuration",
      icon: "⚙️",
      color: "gray"
    }
  };
};
