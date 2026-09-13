'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce repository method naming conventions (getBy, has, valuesBy, add, update)',
      category: 'Architecture',
      recommended: true
    },
    fixable: null,
    schema: []
  },
  create(context) {
    const filename = context.getFilename();

    // Only check files in repository layer
    if (!filename.includes('/repository/')) {
      return {};
    }

    const allowedMethodPrefixes = ['getBy', 'has', 'valuesBy'];
    const allowedExactMethods = ['add', 'update'];

    return {
      MethodDefinition(node) {
        const methodName = node.key.name;

        // Check if method name follows allowed patterns
        const isValid = allowedExactMethods.includes(methodName) || 
                       allowedMethodPrefixes.some(prefix => methodName.startsWith(prefix));

        if (!isValid) {
          context.report({
            node: node.key,
            message: `Repository method '${methodName}' must be one of: getBy*, has*, valuesBy*, add, or update.`,
          });
        }
      }
    };
  }
};