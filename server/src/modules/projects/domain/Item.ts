import { Id } from '../../../shared/domain/Id';
import { type Order } from './Order';

type Props = {
  id: Id;
  description: string;
  categoryId: Id;
  projectId: Id;
  orders: Order[];
};

export class Item {
    private readonly _props: Props;

    constructor(props: Props) {
        this._props = props;
    }

    static create(props: Omit<Props, 'id' | 'orders'>): Item {
        return new Item({
            id: Id.create(),
            orders: [],
            ...props,
        });
    }

    get id(): string {
        return this._props.id.toString();
    }

    get description(): string {
        return this._props.description;
    }

    get categoryId(): string {
        return this._props.categoryId.toString();
    }

    get projectId(): string {
        return this._props.projectId.toString();
    }

    get orders(): Order[] {
        return this._props.orders;
    }

    addOrder(order: Order): void {
        this._props.orders.push(order);
    }
}
