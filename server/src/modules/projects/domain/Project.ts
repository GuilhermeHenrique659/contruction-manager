import { Id } from '../../../shared/domain/Id';
import { ProjectMember } from './ProjectMember';
import { MemberAlreadyExistsError } from './MemberAlreadyExistsError';

type Props = {
  id: Id;
  description: string;
  members: ProjectMember[];
};

export class Project {
    private readonly _props: Props;

    constructor(props: Props) {
        this._props = props;
    }

    static create(props: Omit<Props, 'id' | 'members'>, creatorUserId: string): Project {
        const members = [ProjectMember.create({ userId: creatorUserId, role: 'member' })];
        return new Project({
            id: Id.create(),
            description: props.description,
            members,
        });
    }

    get id(): string {
        return this._props.id.toString();
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
            throw new MemberAlreadyExistsError(member.userId);
        }
        this._props.members.push(member);
    }
}
