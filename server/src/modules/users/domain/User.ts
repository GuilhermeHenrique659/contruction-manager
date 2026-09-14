import { Id } from '../../../shared/domain/Id.js';

type Props = {
        id: Id;
        name: string;
        email: string;
};

export class User {
    private readonly _props: Props;

    constructor(props: Props) {
        this._props = props;
    }

    static create(props: Omit<Props, 'id'>): User {
        return new User({
            id: Id.create(),
            name: props.name,
            email: props.email,
        });
    }

    get id(): string {
        return this._props.id.toString();
    }

    get name(): string {
        return this._props.name;
    }

    get email(): string {
        return this._props.email;
    }
}
