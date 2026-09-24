import { Button } from "../../atoms/Button/Button";
import { Input, Select } from "../../atoms/Input/Input";
import { TableCell } from "../../atoms/Table/TableCell";
import { TableRow } from "../../atoms/Table/TableRow";
import { OrderCard } from "./OrderCard";
import styles from "./ProjectItemRow.module.css";

import type { ProjectItem } from "../../../features/projects/model/ProjectItem";

export function ProjectItemRow({
    item,
    categories,
    onAddOrder,
    onRemoveOrder,
}: {
    item: ProjectItem;
    categories: { value: string; label: string }[];
    onAddOrder: (itemId: string) => void;
    onRemoveOrder: (itemId: string, orderIndex: number) => void;
}) {
    return (
        <TableRow>
            <TableCell className={styles.noBorderField}>
                <Input defaultValue={item.description || ""} fullWidth />
            </TableCell>
            <TableCell className={styles.noBorderField}>
                <Select
                    options={[
                        {
                            value: item.category?.id || "",
                            label:
                                item.category?.description ||
                                "Selecione...",
                        },
                        ...categories,
                    ]}
                    defaultValue={item.category?.id || ""}
                    fullWidth
                />
            </TableCell>
            <TableCell>{item.total ?? 0}</TableCell>
            <TableCell>
                <div className={styles.orders}>
                    {item.orders?.map((order, idx) => (
                        <OrderCard
                            key={order.id || idx}
                            order={order}
                            onRemove={() =>
                                onRemoveOrder(item.id, idx)
                            }
                        />
                    ))}
                    <Button
                        variant="outline"
                        size="sm"
                        className={styles.addOrderBtn}
                        type="button"
                        onClick={() => onAddOrder(item.id)}
                    >
                        + Adicionar compra
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}
