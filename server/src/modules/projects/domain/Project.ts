import { DomainError } from '../../../shared/domain/DomainError';
import { Id } from '../../../shared/domain/Id';
import { ProjectMember } from './ProjectMember';

type Props = {
  id: Id;
  name: string;
  description: string;
  members: ProjectMember[];
};

export class Project {
    private readonly _props: Props;

    constructor(props: Props) {
        this._props = props;
    }

    static create(props: { name: string; description: string }, creatorUserId: string): Project {
        const members = [ProjectMember.create({ userId: creatorUserId, role: 'member' })];
        return new Project({
            id: Id.create(),
            name: props.name,
            description: props.description,
            members,
        });
    }

    get id(): string {
        return this._props.id.toString();
    }

    get name(): string {
        return this._props.name;
    }

    get description(): string {
        return this._props.description;
    }

    get members(): ProjectMember[] {
        return this._props.members;
    }

    addMember(member: ProjectMember): void {
        const exists = this._props.members.some((m) => m.userId === member.userId);
        if (exists) {
            throw new DomainError(`Member ${member.userId} is already associated with this project`);
        }
        this._props.members.push(member);
    }
}
