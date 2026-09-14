import { Id } from '../../../shared/domain/Id.js';

type Props = {
  id: Id;
  name: string;
  paymentDay: number | null;
  projectId: Id;
};

export class Vendor {
    private readonly _props: Props;

    constructor(props: Props) {
        this._props = props;
    }

    static create(props: Omit<Props, 'id'>): Vendor {
        return new Vendor({
            id: Id.create(),
            name: props.name,
            paymentDay: props.paymentDay,
            projectId: props.projectId,
        });
    }

    get id(): string {
        return this._props.id.toString();
    }

    get name(): string {
        return this._props.name;
    }

    get paymentDay(): number | null {
        return this._props.paymentDay;
    }

    get projectId(): string {
        return this._props.projectId.toString();
    }
}
