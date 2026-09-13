'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent importing from domain or repository of other modules',
      category: 'Architecture',
      recommended: true
    },
    fixable: null,
    schema: []
  },
  create(context) {
    const filename = context.getFilename();

    // Only check files in modules directory
    if (!filename.includes('/modules/')) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        const source = node.source.value;

        // Check for imports from domain or repository of other modules
        const domainImportRegex = /^..\/..\/domain\//;
        const repositoryImportRegex = /^..\/..\/repository\//;

        // Extract module name from current file path
        // Example: server/src/modules/obras/application/CreateObra.ts
        // Module name: obras
        const moduleMatch = filename.match(/\/modules\/([^\/]+)\//);
        if (!moduleMatch) return {};

        const currentModule = moduleMatch[1];

        // Check if this is an import from domain or repository
        const isDomainImport = domainImportRegex.test(source);
        const isRepositoryImport = repositoryImportRegex.test(source);

        if (isDomainImport || isRepositoryImport) {
          // Extract imported module name
          // Example: ../../domain/Obra -> would be from some module
          // Example: ../../domain/obras/Obra -> would be from obras module
          const importedPathParts = source.split('/');
          let importedModule = null;

          // Look for module name in the path
          for (let i = 0; i < importedPathParts.length; i++) {
            if (importedPathParts[i] === 'domain' || importedPathParts[i] === 'repository') {
              // Next part should be the module name
              if (importedPathParts[i + 1]) {
                importedModule = importedPathParts[i + 1];
                break;
              }
            }
          }

          // If we found an imported module and it's different from current module, report error
          if (importedModule && importedModule !== currentModule) {
            context.report({
              node,
              message: `Module '${currentModule}' cannot import ${isDomainImport ? 'domain' : 'repository'} from module '${importedModule}'. Modules must be isolated.`,
            });
          }
        }
      }
    };
  }
};