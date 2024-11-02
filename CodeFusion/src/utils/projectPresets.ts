export const projectPresets = {
    react: {
      autoUnselectFolders: ['node_modules', '.next', 'dist', 'build', '.git'],
      acceptedTypes: [
        '.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.css', '.scss', 
        '.env', '.gitignore', '.lock', '.yml', '.yaml', '.graphql'
      ]
    },
    python: {
      autoUnselectFolders: ['venv', '__pycache__', '.git'],
      acceptedTypes: [
        '.py', '.txt', '.md', '.json', '.yml', '.yaml', '.env', '.gitignore'
      ]
    },
    // Add more presets as needed
  };