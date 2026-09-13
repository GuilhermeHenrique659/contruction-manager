'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent domain services from calling repository write methods',
      category: 'Architecture',
      recommended: true
    },
    fixable: null,
    schema: []
  },
  create(context) {
    const filename = context.getFilename();

    // Only check files in domain layer
    if (!filename.includes('/domain/')) {
      return {};
    }

    // Write methods that domain services should not call
    const writeMethods = ['add', 'update', 'remove', 'delete', 'save', 'persist'];

    return {
      // Check for MemberExpression like repository.add() or repository.update()
      CallExpression(node) {
        if (node.callee && node.callee.type === 'MemberExpression') {
          const methodName = node.callee.property.name;
          
          // Check if it's a write method
          const isWriteMethod = writeMethods.includes(methodName);
          
          if (isWriteMethod) {
            // Check if the object being called is likely a repository
            // This is a heuristic - in reality we'd need better type information
            const objectName = node.callee.object.name;
            const isLikelyRepository = 
              objectName.toLowerCase().includes('repository') ||
              objectName.endsWith('Repository') ||
              objectName.toLowerCase().includes('repo');
            
            if (isLikelyRepository) {
              context.report({
                node: node.callee.property,
                message: `Domain services should not call repository write methods like '${methodName}'. Domain services must be side-effect free for writing operations.`,
              });
            }
          }
        }
      }
    };
  }
};