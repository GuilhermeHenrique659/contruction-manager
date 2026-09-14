export type ProjectMemberProps = {
  userId: string;
  role: 'member';
};

export class ProjectMember {
    private readonly _props: ProjectMemberProps;

    constructor(props: ProjectMemberProps) {
        this._props = props;
    }

    static create(props: ProjectMemberProps): ProjectMember {
        return new ProjectMember(props);
    }

    get userId(): string {
        return this._props.userId;
    }

    get role(): string {
        return this._props.role;
    }
}
