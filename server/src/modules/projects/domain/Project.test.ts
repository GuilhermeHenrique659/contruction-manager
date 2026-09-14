import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Project } from './Project.js';
import { ProjectMember } from './ProjectMember.js';
import { MemberAlreadyExistsError } from './MemberAlreadyExistsError.js';

describe('Project', () => {
    it('given members when addMember with new user then adds member', () => {
        const project = Project.create({ description: 'Desc' }, 'u1');

        project.addMember(ProjectMember.create({ userId: 'u2', role: 'member' }));

        assert.strictEqual(project.members.length, 2);
        assert.strictEqual(project.members[1].userId, 'u2');
    });

    it('given existing member when addMember with same user then throws MemberAlreadyExistsError', () => {
        const project = Project.create({ description: 'Desc' }, 'u1');

        assert.throws(
            () => project.addMember(ProjectMember.create({ userId: 'u1', role: 'member' })),
            MemberAlreadyExistsError
        );
    });
});
