import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Project } from './Project';
import { ProjectMember } from './ProjectMember';
import { DomainError } from '../../../shared/domain/DomainError';

describe('Project', () => {
    it('given members when addMember with new user then adds member', () => {
        const project = Project.create({ name: 'Test Project', description: 'Desc' }, 'u1');

        project.addMember(ProjectMember.create({ userId: 'u2', role: 'member' }));

        assert.strictEqual(project.members.length, 2);
        assert.strictEqual(project.members[1].userId, 'u2');
    });

    it('given existing member when addMember with same user then throws DomainError', () => {
        const project = Project.create({ name: 'Test Project', description: 'Desc' }, 'u1');

        assert.throws(
            () => project.addMember(ProjectMember.create({ userId: 'u1', role: 'member' })),
            DomainError
        );
    });
});
