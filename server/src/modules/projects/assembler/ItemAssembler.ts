import type { ItemRow } from '../query/ItemQuery';

export type Output = {
    id: string;
    description: string;
    category: {
        id: string;
        description: string;
    };
    orders: {
        id: string;
        quantity: number;
        price: number;
        status: string;
        purchasedAt: Date | null;
        vendor: {
            id: string;
            name: string;
            paymentDay: number | null;
        };
    }[];
}[];

export class ItemAssembler {
    static toOutput(rows: ItemRow[]): Output {
        return rows.map(r => ({
            id: r.id,
            description: r.description,
            category: {
                id: r.categoryId,
                description: r.categoryDescription,
            },
            orders: r.orders.map(o => ({
                id: o.id,
                quantity: o.quantity,
                price: o.price,
                status: o.status,
                purchasedAt: o.purchasedAt,
                vendor: {
                    id: o.vendorId,
                    name: o.vendorName,
                    paymentDay: o.vendorPaymentDay,
                },
            })),
        }));
    }
}
