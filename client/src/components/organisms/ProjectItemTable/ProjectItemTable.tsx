import { useEffect, useRef, useState } from "react";
import { FetchCategoryGateway } from "../../../features/categories/gateway/FetchCategoryGateway";
import { useAsyncAction } from "../../../hooks/useAsyncAction";
import { useForm } from "../../../hooks/useForm";
import { Button } from "../../atoms/Button/Button";
import { Input, Select } from "../../atoms/Input/Input";
import { Table } from "../../atoms/Table/Table";
import { TableBody } from "../../atoms/Table/TableBody";
import { TableCell } from "../../atoms/Table/TableCell";
import { TableHead } from "../../atoms/Table/TableHead";
import { TableHeaderCell } from "../../atoms/Table/TableHeaderCell";
import { TableRow } from "../../atoms/Table/TableRow";
import { TableHeadBar } from "../../molecules/TableHeadBar/TableHeadBar";
import { AddOrderModal } from "./AddOrderModal";
import { ProjectItemRow } from "./ProjectItemRow";
import {
    buildNewItem,
    buildOrder,
    withOrderAdded,
    withOrderRemoved,
} from "./ProjectItemTable.mapper";
import styles from "./ProjectItemTable.module.css";

import type { ProjectItem } from "../../../features/projects/model/ProjectItem";
import type { Vendor } from "../../../features/projects/model/Vendor";
import type { OrderDraft } from "./ProjectItemTable.mapper";

export function ProjectItemTable({
    items,
    vendors,
    onAdd,
    onAddOrder,
}: {
    items: ProjectItem[];
    vendors: Vendor[];
    onAdd: (input: {
        description: string;
        categoryId: string;
    }) => Promise<{ id: string }>;
    onAddOrder: (input: {
        itemId: string;
        quantity: number;
        price: number;
        vendorId: string;
        purchasedAt?: string;
    }) => Promise<{ orderId: string }>;
}) {
    const [showAdd, setShowAdd] = useState(false);
    const [localItems, setLocalItems] = useState<ProjectItem[]>(items);
    const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(
        null,
    );
    const [categories, setCategories] = useState<
        { value: string; label: string }[]
    >([]);
    const { run: runItemSave } = useAsyncAction();
    const { run: runOrderSave } = useAsyncAction();
    const {
        values: itemValues,
        setField: setItemField,
        reset: resetItemForm,
    } = useForm({ description: "", categoryId: "" });
    const addRowRef = useRef<HTMLTableRowElement>(null);

    const handleSave = () => {
        void runItemSave(async () => {
            const { id } = await onAdd({
                description: itemValues.description.trim(),
                categoryId: itemValues.categoryId,
            });
            setLocalItems((prev) => [
                ...prev,
                buildNewItem(
                    id,
                    itemValues.description.trim(),
                    itemValues.categoryId,
                    categories,
                ),
            ]);
            setShowAdd(false);
        });
    };

    const handleBlur = (e: React.FocusEvent) => {
        if (
            addRowRef.current &&
            e.relatedTarget instanceof Node &&
            addRowRef.current.contains(e.relatedTarget)
        )
            return;
        if (!itemValues.description.trim() || !itemValues.categoryId) {
            setShowAdd(false);
            return;
        }
        handleSave();
    };

    useEffect(() => {
        if (!showAdd) {
            resetItemForm();
        }
    }, [showAdd, resetItemForm]);

    const handleAddOrder = (itemId: string) => {
        setSelectedItemId(itemId);
        setPurchaseModalOpen(true);
    };

    const handleSaveOrder = (draft: OrderDraft): Promise<boolean> => {
        if (selectedItemId === null) return Promise.resolve(false);
        return runOrderSave(async () => {
            const { orderId } = await onAddOrder({
                itemId: selectedItemId,
                quantity: draft.quantity,
                price: draft.price,
                vendorId: draft.vendorId,
                purchasedAt: draft.purchasedAt,
            });
            setLocalItems((prev) =>
                withOrderAdded(
                    prev,
                    selectedItemId,
                    buildOrder(orderId, draft, vendors),
                ),
            );
        });
    };

    const handleRemoveOrder = (itemId: string, orderIndex: number) => {
        setLocalItems((prev) => withOrderRemoved(prev, itemId, orderIndex));
    };

    useEffect(() => {
        new FetchCategoryGateway()
            .listAll()
            .then((list) => {
                setCategories(
                    list.map((c) => ({ value: c.id, label: c.description })),
                );
            })
            .catch(() => {
                setCategories([]);
            });
    }, []);

    return (
        <div className={styles.tableWrap}>
            <TableHeadBar
                title="Itens — Projeto"
                count={items.length}
                action={
                    !showAdd ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAdd(true)}
                        >
                            {`+ Adicionar item`}
                        </Button>
                    ) : null
                }
            />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeaderCell>Descrição</TableHeaderCell>
                        <TableHeaderCell>Categoria</TableHeaderCell>
                        <TableHeaderCell>Total</TableHeaderCell>
                        <TableHeaderCell>Compras</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {localItems.map((item) => (
                        <ProjectItemRow
                            key={item.id}
                            item={item}
                            categories={categories}
                            onAddOrder={handleAddOrder}
                            onRemoveOrder={handleRemoveOrder}
                        />
                    ))}
                    {showAdd && (
                        <TableRow ref={addRowRef}>
                            <TableCell className={styles.noBorderField}>
                                <Input
                                    placeholder="Novo item..."
                                    fullWidth
                                    value={itemValues.description}
                                    onChange={(e) =>
                                        setItemField(
                                            "description",
                                            e.target.value,
                                        )
                                    }
                                    onBlur={handleBlur}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSave();
                                    }}
                                />
                            </TableCell>
                            <TableCell className={styles.noBorderField}>
                                <Select
                                    options={[...categories]}
                                    fullWidth
                                    value={itemValues.categoryId}
                                    onChange={(e) =>
                                        setItemField(
                                            "categoryId",
                                            e.target.value,
                                        )
                                    }
                                    onBlur={handleBlur}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter")
                                            handleSave();
                                    }}
                                />
                            </TableCell>
                            <TableCell>—</TableCell>
                            <TableCell>—</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <AddOrderModal
                isOpen={purchaseModalOpen}
                vendors={vendors}
                onClose={() => setPurchaseModalOpen(false)}
                onSave={handleSaveOrder}
            />
        </div>
    );
}
