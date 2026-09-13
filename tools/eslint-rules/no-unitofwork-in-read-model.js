'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent use case of reading layer from using UnitOfWork',
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

    // Determine if this is a read model use case
    const basename = filename.split('/').pop().replace(/\.[jt]sx?$/, '');
    const isReadModel = /^(Get|List|Find|Search)/.test(basename);

    return {
      // Check for MemberExpression like unitOfWork.run or this.unitOfWork
      MemberExpression(node) {
        // Check if it's accessing unitOfWork property
        if (node.property && node.property.name === 'run' && 
            node.object && 
            (node.object.name === 'unitOfWork' || 
             (node.object.type === 'MemberExpression' && 
              node.object.object && 
              node.object.object.type === 'ThisExpression' && 
              node.object.property && 
              node.object.property.name === 'unitOfWork'))) {
          
          context.report({
            node: node.object,
            message: `Read model use case '${basename}' should not use UnitOfWork. Read models do not manage transactions.`,
          });
        }
      }
    };
  }
};