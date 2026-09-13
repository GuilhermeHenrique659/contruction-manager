'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent direct process.env usage - must use shared/config/env.ts',
      category: 'Architecture',
      recommended: true
    },
    fixable: null,
    schema: []
  },
  create(context) {
    return {
      MemberExpression(node) {
        // Check for process.env.* usage
        if (node.object && 
            node.object.type === 'MemberExpression' &&
            node.object.object &&
            node.object.object.type === 'Identifier' &&
            node.object.object.name === 'process' &&
            node.object.property &&
            node.object.property.name === 'env') {
          
          context.report({
            node: node.object,
            message: 'Direct process.env usage is forbidden. Use shared/config/env.ts instead.',
          });
        }
      }
    };
  }
};