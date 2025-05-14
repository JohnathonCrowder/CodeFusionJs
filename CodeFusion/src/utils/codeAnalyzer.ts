interface ProjectAnalysis {
  projectType: string;
  mainFiles: string[];
  summary: string;
  techStack: string[];
  architecture: string;
  keyComponents: string[];
  dependencies: Record<string, string>;
  fileStructure: string;
  recommendations: string[];
}

interface FileAnalysis {
  path: string;
  type: 'component' | 'config' | 'test' | 'style' | 'utility' | 'unknown';
  importance: number; // 1-10
  dependencies: string[];
  exports: string[];
  description: string;
}

export class CodeAnalyzer {
  private fileAnalyses: FileAnalysis[] = [];
  
  analyzeProject(files: any[]): ProjectAnalysis {
    this.fileAnalyses = this.analyzeFiles(files);
    
    const projectType = this.detectProjectType(files);
    const techStack = this.detectTechStack(files);
    const mainFiles = this.identifyMainFiles(files);
    const architecture = this.analyzeArchitecture(files);
    const dependencies = this.extractDependencies(files);
    const keyComponents = this.identifyKeyComponents(files);
    const fileStructure = this.generateFileStructure(files);
    const recommendations = this.generateRecommendations();
    const summary = this.generateProjectSummary({
      projectType,
      techStack,
      mainFiles,
      architecture,
      keyComponents,
      dependencies
    });

    return {
      projectType,
      mainFiles,
      summary,
      techStack,
      architecture,
      keyComponents,
      dependencies,
      fileStructure,
      recommendations
    };
  }

  private analyzeFiles(files: any[]): FileAnalysis[] {
    return files.flatMap(file => this.analyzeFileRecursive(file));
  }

  private analyzeFileRecursive(file: any, parentPath = ''): FileAnalysis[] {
    const analyses: FileAnalysis[] = [];
    
    if (file.content && file.visible) {
      const fullPath = parentPath ? `${parentPath}/${file.name}` : file.name;
      analyses.push(this.analyzeFile(file, fullPath));
    }

    if (file.children) {
      const currentPath = parentPath ? `${parentPath}/${file.name}` : file.name;
      file.children.forEach((child: any) => {
        analyses.push(...this.analyzeFileRecursive(child, currentPath));
      });
    }

    return analyses;
  }

  private analyzeFile(file: any, path: string): FileAnalysis {
    const content = file.content;
    const extension = path.split('.').pop()?.toLowerCase() || '';
    
    let type: FileAnalysis['type'] = 'unknown';
    let importance = 1;
    const dependencies: string[] = [];
    const exports: string[] = [];
    let description = '';

    // Analyze based on file extension and content
    if (extension === 'tsx' || extension === 'jsx') {
      type = 'component';
      importance = this.calculateComponentImportance(content, path);
      dependencies.push(...this.extractImports(content));
      exports.push(...this.extractExports(content));
      description = this.generateComponentDescription(content, path);
    } else if (extension === 'ts' || extension === 'js') {
      type = this.isUtilityFile(path) ? 'utility' : 'component';
      importance = this.calculateJSImportance(content, path);
      dependencies.push(...this.extractImports(content));
      exports.push(...this.extractExports(content));
      description = this.generateJSDescription(content, path);
    } else if (extension === 'css' || extension === 'scss') {
      type = 'style';
      importance = 3;
      description = `Stylesheet for ${path}`;
    } else if (this.isConfigFile(path)) {
      type = 'config';
      importance = this.calculateConfigImportance(path);
      description = this.generateConfigDescription(path);
    } else if (this.isTestFile(path)) {
      type = 'test';
      importance = 2;
      description = `Test file for ${path.replace(/\.(test|spec)\./, '.')}`;
    }

    return {
      path,
      type,
      importance,
      dependencies,
      exports,
      description
    };
  }

  private detectProjectType(files: any[]): string {
    const packageJson = this.findFile(files, 'package.json');
    if (packageJson) {
      try {
        const pkg = JSON.parse(packageJson.content);
        if (pkg.dependencies?.react || pkg.devDependencies?.react) return 'React';
        if (pkg.dependencies?.next || pkg.devDependencies?.next) return 'Next.js';
        if (pkg.dependencies?.vue || pkg.devDependencies?.vue) return 'Vue.js';
        if (pkg.dependencies?.angular || pkg.devDependencies?.angular) return 'Angular';
        if (pkg.dependencies?.express) return 'Express/Node.js';
        return 'JavaScript/TypeScript';
      } catch (e) {
        // Ignore parsing errors
      }
    }

    if (this.findFile(files, 'requirements.txt') || this.findFile(files, 'setup.py')) {
      return 'Python';
    }

    if (this.findFile(files, 'Cargo.toml')) return 'Rust';
    if (this.findFile(files, 'pom.xml') || this.findFile(files, 'build.gradle')) return 'Java';
    if (this.findFile(files, 'go.mod')) return 'Go';

    return 'Unknown';
  }

  private detectTechStack(files: any[]): string[] {
    const techStack = new Set<string>();
    
    // Check package.json for dependencies
    const packageJson = this.findFile(files, 'package.json');
    if (packageJson) {
      try {
        const pkg = JSON.parse(packageJson.content);
        const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
        
        Object.keys(allDeps).forEach(dep => {
          if (dep.includes('react')) techStack.add('React');
          if (dep.includes('vue')) techStack.add('Vue.js');
          if (dep.includes('angular')) techStack.add('Angular');
          if (dep.includes('express')) techStack.add('Express');
          if (dep.includes('next')) techStack.add('Next.js');
          if (dep.includes('tailwind')) techStack.add('Tailwind CSS');
          if (dep.includes('typescript')) techStack.add('TypeScript');
        });
      } catch (e) {
        // Ignore parsing errors
      }
    }

    // Check for specific files
    if (this.findFile(files, 'tailwind.config.js')) techStack.add('Tailwind CSS');
    if (this.findFile(files, 'vite.config.ts')) techStack.add('Vite');
    if (this.findFile(files, 'webpack.config.js')) techStack.add('Webpack');

    return Array.from(techStack);
  }

  private identifyMainFiles(_files: any[]): string[] {
    const mainFiles: string[] = [];
    
    // Common main files to look for
    const mainFilePatterns = [
      'index.js', 'index.ts', 'index.tsx',
      'App.js', 'App.ts', 'App.tsx',
      'main.js', 'main.ts', 'main.tsx',
      'server.js', 'server.ts',
      'app.py', 'main.py'
    ];

    this.fileAnalyses.forEach(analysis => {
      const fileName = analysis.path.split('/').pop() || '';
      if (mainFilePatterns.some(pattern => fileName === pattern)) {
        mainFiles.push(analysis.path);
      }
      // Also include files with high importance scores
      if (analysis.importance >= 8) {
        mainFiles.push(analysis.path);
      }
    });

    return [...new Set(mainFiles)];
  }

  private generateProjectSummary(data: Partial<ProjectAnalysis>): string {
    const parts = [
      `# ${data.projectType} Project Analysis`,
      '',
      '## Overview',
      `This appears to be a ${data.projectType} project using the following technologies:`,
      ...data.techStack!.map(tech => `- ${tech}`),
      '',
      '## Architecture',
      data.architecture,
      '',
      '## Key Components',
      ...data.keyComponents!.map(comp => `- ${comp}`),
      '',
      '## Main Entry Points',
      ...data.mainFiles!.map(file => `- \`${file}\``),
      ''
    ];

    if (Object.keys(data.dependencies!).length > 0) {
      parts.push('## Key Dependencies');
      Object.entries(data.dependencies!).forEach(([name, version]) => {
        parts.push(`- ${name}: ${version}`);
      });
      parts.push('');
    }

    return parts.join('\n');
  }

  // Helper methods...
  private findFile(files: any[], fileName: string): any {
    for (const file of files) {
      if (file.name === fileName && file.content) return file;
      if (file.children) {
        const found = this.findFile(file.children, fileName);
        if (found) return found;
      }
    }
    return null;
  }

  private extractImports(content: string): string[] {
    const importRegex = /import.*from\s+['"`]([^'"`]+)['"`]/g;
    const imports = [];
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    return imports;
  }

  private extractExports(content: string): string[] {
    const exportRegex = /export\s+(?:default\s+)?(?:function|class|const|let|var)\s+(\w+)/g;
    const exports = [];
    let match;
    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }
    return exports;
  }

  private calculateComponentImportance(content: string, path: string): number {
    let score = 5; // Base score
    
    // Higher importance for main components
    if (path.includes('App.tsx') || path.includes('index.tsx')) score += 3;
    
    // Check for hooks, lifecycle methods
    if (content.includes('useState') || content.includes('useEffect')) score += 1;
    
    // Check for routing
    if (content.includes('Router') || content.includes('Route')) score += 2;
    
    // Check for complexity (number of imports, functions, etc.)
    const importCount = (content.match(/import.*from/g) || []).length;
    const functionCount = (content.match(/function\s+\w+/g) || []).length + (content.match(/const\s+\w+\s*=/g) || []).length;
    
    score += Math.min(importCount / 5, 2);
    score += Math.min(functionCount / 3, 2);
    
    return Math.min(score, 10);
  }

  private calculateJSImportance(_content: string, path: string): number {
    let score = 4;
    
    if (path.includes('util') || path.includes('helper')) score += 2;
    if (path.includes('api') || path.includes('service')) score += 2;
    if (path.includes('store') || path.includes('reducer')) score += 2;
    
    return Math.min(score, 10);
  }

  private calculateConfigImportance(path: string): number {
    if (path.includes('package.json')) return 9;
    if (path.includes('tsconfig') || path.includes('vite.config')) return 7;
    if (path.includes('tailwind.config')) return 6;
    return 5;
  }

  private isUtilityFile(path: string): boolean {
    return path.includes('util') || path.includes('helper') || path.includes('lib');
  }

  private isConfigFile(path: string): boolean {
    const configFiles = [
      'package.json', 'tsconfig.json', 'vite.config.ts', 'tailwind.config.js',
      'next.config.js', 'webpack.config.js', '.env', '.gitignore'
    ];
    const fileName = path.split('/').pop() || '';
    return configFiles.some(config => fileName.includes(config));
  }

  private isTestFile(path: string): boolean {
    return path.includes('.test.') || path.includes('.spec.') || path.includes('__tests__');
  }

  private analyzeArchitecture(_files: any[]): string {
    const hasComponents = this.fileAnalyses.some(f => f.type === 'component');
    const hasUtils = this.fileAnalyses.some(f => f.type === 'utility');
    const hasTests = this.fileAnalyses.some(f => f.type === 'test');
    const hasConfig = this.fileAnalyses.some(f => f.type === 'config');

    let architecture = 'The project follows ';
    
    if (hasComponents && hasUtils) {
      architecture += 'a component-based architecture with separated utilities. ';
    }
    
    if (hasTests) {
      architecture += 'Testing is implemented. ';
    }
    
    if (hasConfig) {
      architecture += 'Configuration files are properly organized.';
    }

    return architecture || 'Standard project structure.';
  }

  private extractDependencies(files: any[]): Record<string, string> {
    const packageJson = this.findFile(files, 'package.json');
    if (packageJson) {
      try {
        const pkg = JSON.parse(packageJson.content);
        return { ...pkg.dependencies, ...pkg.devDependencies };
      } catch (e) {
        return {};
      }
    }
    return {};
  }

  private identifyKeyComponents(_files: any[]): string[] {
    return this.fileAnalyses
      .filter(f => f.importance >= 7)
      .map(f => `${f.path} - ${f.description}`)
      .slice(0, 5); // Top 5 most important
  }

  private generateFileStructure(files: any[]): string {
    const generateTree = (files: any[], prefix = '', _isLast = true): string => {
      let result = '';
      files.forEach((file, index) => {
        const isLastFile = index === files.length - 1;
        const connector = isLastFile ? '└── ' : '├── ';
        result += `${prefix}${connector}${file.name}\n`;
        
        if (file.children && file.children.length > 0) {
          const childPrefix = prefix + (isLastFile ? '    ' : '│   ');
          result += generateTree(file.children, childPrefix);
        }
      });
      return result;
    };

    return generateTree(files);
  }

  private generateRecommendations(): string[] {
    const recommendations = [];
    
    // Check for common important files that should be included
    const hasMainFiles = this.fileAnalyses.some(f => f.path.includes('App.') || f.path.includes('index.'));
    if (!hasMainFiles) {
      recommendations.push('Consider including main entry point files (App.tsx, index.tsx)');
    }

    const hasConfig = this.fileAnalyses.some(f => f.type === 'config' && f.importance >= 7);
    if (!hasConfig) {
      recommendations.push('Include configuration files like package.json for better context');
    }

    const hasReadme = this.fileAnalyses.some(f => f.path.toLowerCase().includes('readme'));
    if (!hasReadme) {
      recommendations.push('Add a README file to explain the project structure');
    }

    return recommendations;
  }

  private generateComponentDescription(content: string, path: string): string {
    const fileName = path.split('/').pop()?.replace(/\.[^/.]+$/, '') || '';
    
    if (content.includes('export default')) {
      return `Main ${fileName} component`;
    }
    
    const hasHooks = content.includes('useState') || content.includes('useEffect');
    const hasProps = content.includes('Props') || content.includes('interface');
    
    let description = `React component`;
    if (hasHooks) description += ' with state management';
    if (hasProps) description += ' with typed props';
    
    return description;
  }

  private generateJSDescription(_content: string, path: string): string {
    const fileName = path.split('/').pop()?.replace(/\.[^/.]+$/, '') || '';
    
    if (path.includes('util') || path.includes('helper')) {
      return `Utility functions for ${fileName}`;
    }
    
    if (path.includes('api') || path.includes('service')) {
      return `API service for ${fileName}`;
    }
    
    return `JavaScript module: ${fileName}`;
  }

  private generateConfigDescription(path: string): string {
    const fileName = path.split('/').pop() || '';
    
    if (fileName.includes('package.json')) return 'Project dependencies and metadata';
    if (fileName.includes('tsconfig')) return 'TypeScript configuration';
    if (fileName.includes('vite.config')) return 'Vite build configuration';
    if (fileName.includes('tailwind.config')) return 'Tailwind CSS configuration';
    
    return `Configuration file: ${fileName}`;
  }
}