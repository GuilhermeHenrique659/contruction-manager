import { Button } from "../../atoms/Button/Button";
import { Badge, CardTag } from "../../atoms/Card/Card";
import { IconX } from "../../atoms/Icon/IconX";
import { StatusMap, formatBRL } from "./ProjectItemTable.mapper";
import styles from "./OrderCard.module.css";

import type { ProjectItem } from "../../../features/projects/model/ProjectItem";

export function OrderCard({
    order,
    onRemove,
}: {
    order: ProjectItem["orders"][number];
    onRemove: () => void;
}) {
    return (
        <div className={styles.orderCard}>
            <div className={styles.info}>
                <div className={styles.desc}>
                    <CardTag>{order.quantity}x</CardTag>{" "}
                    <Badge variant="neutral">
                        {StatusMap[order.status] || order.status || "—"}
                    </Badge>
                </div>
                <div className={styles.detail}>
                    {formatBRL(order.price)} un. — subtotal{" "}
                    {formatBRL(order.price * order.quantity)}
                </div>
            </div>
            <Button
                variant="danger"
                size="sm"
                className={styles.removeBtn}
                aria-label="Remover compra"
                title="Remover"
                onClick={onRemove}
            >
                <IconX size={14} />
            </Button>
        </div>
    );
}
