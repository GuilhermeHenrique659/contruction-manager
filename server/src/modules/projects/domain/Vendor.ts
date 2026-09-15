import { Id } from '../../../shared/domain/Id';
import { DayOfMonth } from './DayOfMonth';

type Props = {
  id: Id;
  name: string;
  paymentDay: DayOfMonth | null;
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

    get paymentDay(): DayOfMonth | null {
        return this._props.paymentDay;
    }

    get projectId(): string {
        return this._props.projectId.toString();
    }

    updateName(name?: string): void {
        if (name === undefined) return;
        this._props.name = name;
    }

    updatePaymentDay(paymentDay?: number | null): void {
        if (paymentDay === undefined) return;
        this._props.paymentDay = paymentDay !== null ? new DayOfMonth(paymentDay) : null;
    }
}
