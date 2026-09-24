import type { ProjectItem } from '../../../features/projects/model/ProjectItem';
import type { Vendor } from '../../../features/projects/model/Vendor';

export const StatusMap: Record<string, string> = {
  pending_payment: 'Pendente',
  paid: 'Pago',
};

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export interface OrderDraft {
  quantity: number;
  price: number;
  vendorId: string;
  status: string;
  purchasedAt?: string;
}

export function buildNewItem(
  id: string,
  description: string,
  categoryId: string,
  categories: { value: string; label: string }[],
): ProjectItem {
  return {
    id,
    description,
    total: 0,
    category: {
      id: categoryId,
      description:
        categories.find((c) => c.value === categoryId)?.label ?? '',
    },
    orders: [],
  };
}

export function buildOrder(
  orderId: string,
  draft: OrderDraft,
  vendors: Vendor[],
): ProjectItem['orders'][number] {
  const vendor = vendors.find((v) => v.id === draft.vendorId);
  return {
    id: orderId,
    quantity: draft.quantity,
    price: draft.price,
    status: draft.status || 'pending_payment',
    purchasedAt: draft.purchasedAt ? new Date(draft.purchasedAt) : new Date(),
    vendor: vendor
      ? {
          id: vendor.id,
          name: vendor.name,
          paymentDay: vendor.paymentDay,
        }
      : {
          id: draft.vendorId,
          name: '',
          paymentDay: null,
        },
  };
}

export function withOrderAdded(
  items: ProjectItem[],
  itemId: string,
  order: ProjectItem['orders'][number],
): ProjectItem[] {
  return items.map((item) =>
    item.id === itemId ? { ...item, orders: [...item.orders, order] } : item,
  );
}

export function withOrderRemoved(
  items: ProjectItem[],
  itemId: string,
  orderIndex: number,
): ProjectItem[] {
  return items.map((item) =>
    item.id === itemId
      ? {
          ...item,
          orders: item.orders.filter((_, idx) => idx !== orderIndex),
        }
      : item,
  );
}
