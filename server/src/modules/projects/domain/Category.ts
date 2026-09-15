import { Id } from '../../../shared/domain/Id';

type Props = {
  id: Id;
  description: string;
};

export class Category {
    private readonly _props: Props;

    constructor(props: Props) {
        this._props = props;
    }

    static create(props: { description: string }): Category {
        return new Category({
            id: Id.create(),
            description: props.description,
        });
    }

    get id(): string {
        return this._props.id.toString();
    }

    get description(): string {
        return this._props.description;
    }
}
