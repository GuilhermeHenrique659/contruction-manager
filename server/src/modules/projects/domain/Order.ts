import { type OrderQuantity } from './OrderQuantity';
import { type OrderPrice } from './OrderPrice';
import { OrderStatus } from './OrderStatus';
import { OrderPurchasedAt } from './OrderPurchasedAt';
import { Id } from '../../../shared/domain/Id';

type Props = {
  id: Id;
  itemId: Id;
  quantity: OrderQuantity;
  price: OrderPrice;
  vendorId: Id;
  status: OrderStatus;
  purchasedAt: OrderPurchasedAt;
};

export class Order {
    private readonly _props: Props;

    private constructor(props: Props) {
        this._props = props;
    }

    static create(props: Omit<Props, 'id' | 'status' | 'purchasedAt'> & { status?: string; purchasedAt?: Date | string }): Order {
        const status = OrderStatus.create(props.status ?? 'pending_payment');
        const purchasedAt = OrderPurchasedAt.create(props.purchasedAt ?? new Date());
        return new Order({
            id: Id.create(),
            ...props,
            status: status,
            purchasedAt: purchasedAt,
        });
    }

    get id(): string { return this._props.id.toString(); }
    get quantity(): number { return this._props.quantity.getValue(); }
    get price(): number { return this._props.price.getValue(); }
    get vendorId(): string { return this._props.vendorId.toString(); }
    get status(): 'pending_payment' | 'paid' { return this._props.status.getValue(); }
    get purchasedAt(): Date { return this._props.purchasedAt.getValue(); }
}
