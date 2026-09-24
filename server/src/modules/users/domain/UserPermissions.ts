const userPermissions = new Map<string, string[]>();

userPermissions.set('project:create', ['admin', 'member']);
userPermissions.set('project:read', ['admin', 'member']);
userPermissions.set('project:update', ['admin', 'member']);
userPermissions.set('project:delete', ['admin', 'member']);

userPermissions.set('vendor:create', ['admin', 'member']);
userPermissions.set('vendor:read', ['admin', 'member']);
userPermissions.set('vendor:update', ['admin', 'member']);
userPermissions.set('vendor:delete', ['admin', 'member']);

userPermissions.set('item:create', ['admin', 'member']);
userPermissions.set('item:read', ['admin', 'member']);
userPermissions.set('item:update', ['admin', 'member']);
userPermissions.set('item:delete', ['admin', 'member']);

userPermissions.set('order:create', ['admin', 'member']);

userPermissions.set('category:create', ['admin']);
userPermissions.set('category:read', ['admin']);
userPermissions.set('category:update', ['admin']);
userPermissions.set('category:delete', ['admin']);

export { userPermissions };