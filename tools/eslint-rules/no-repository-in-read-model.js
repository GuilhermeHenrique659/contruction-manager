'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent use case of reading layer from importing repository',
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

    // Determine if this is a read model use case by checking if it contains query-related patterns
    // Read models typically have names like Get*, List*, Find*, Search*, etc.
    const basename = filename.split('/').pop().replace(/\.[jt]sx?$/, '');
    const isReadModel = /^(Get|List|Find|Search)/.test(basename);

    // If it's not clearly a read model, we'll still check but be less strict
    // In a real implementation, you might want to be more sophisticated here

    return {
      ImportDeclaration(node) {
        const source = node.source.value;

        // Check for imports from repository
        const repositoryImportRegex = /^..\/..\/repository\//;

        if (repositoryImportRegex.test(source)) {
          context.report({
            node,
            message: `Read model use case '${basename}' should not import repository. Use query/assembler instead.`,
          });
        }
      }
    };
  }
};