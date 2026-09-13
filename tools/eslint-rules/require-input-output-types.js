'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce that use case files define Input and Output types',
      category: 'Architecture',
      recommended: true
    },
    fixable: null,
    schema: []
  },
  create(context) {
    const filename = context.getFilename();

    // Only check files in application layer
    if (!filename.includes('/application/')) {
      return {};
    }

    const basename = filename.split('/').pop().replace(/\.[jt]sx?$/, '');
    const isUseCase = /^[A-Z][a-zA-Z]+$/.test(basename); // PascalCase without verbs like Get/List at start

    // Skip obvious read models (Get*, List*, etc.) for this rule if needed
    // But we'll apply to all application files for simplicity

    let hasInputType = false;
    let hasOutputType = false;
    let sourceCode = null;

    return {
      Program() {
        sourceCode = context.getSourceCode();
      },
      'TSTypeAlias[node.name.name="Input"]'(node) {
        hasInputType = true;
      },
      'TSTypeAlias[node.name.name="Output"]'(node) {
        hasOutputType = true;
      },
      'TSInterfaceDeclaration[node.name.name="Input"]'(node) {
        hasInputType = true;
      },
      'TSInterfaceDeclaration[node.name.name="Output"]'(node) {
        hasOutputType = true;
      },
      'Program:exit'() {
        if (!(hasInputType && hasOutputType)) {
          context.report({
            node: sourceCode ? sourceCode.ast : null,
            message: `Use case file '${basename}.ts' must define both Input and Output types.`,
          });
        }
      }
    };
  }
};