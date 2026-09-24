import { Modal } from "../../atoms/Modal/Modal";
import { Badge, CardTag } from "../../atoms/Card/Card";
import { Button } from "../../atoms/Button/Button";
import { IconX } from "../../atoms/Icon/IconX";
import { useState, useEffect, useRef } from "react";
import { FetchCategoryGateway } from "../../../features/categories/gateway/FetchCategoryGateway";
import { Table } from "../../atoms/Table/Table";
import { TableHead } from "../../atoms/Table/TableHead";
import { TableBody } from "../../atoms/Table/TableBody";
import { TableHeaderCell } from "../../atoms/Table/TableHeaderCell";
import { Select, Input } from "../../atoms/Input/Input";
import { TableHeadBar } from "../../molecules/TableHeadBar/TableHeadBar";
import { TableRow } from "../../atoms/Table/TableRow";
import { TableCell } from "../../atoms/Table/TableCell";
import { Vendor } from "../../../features/projects/model/Vendor";
import { useForm } from "../../../hooks/useForm";
import styles from "./ProjectItemTable.module.css";
import { StatusMap } from "./ProjectItemTable.mapper";

export interface ProjectItem {
    id: number | string;
    description: string;
    total: number;
    category: { id: string; description: string };
    orders: {
        id: string;
        quantity: number;
        price: number;
        status: string;
        purchasedAt: Date | null;
        vendor: { id: string; name: string; paymentDay: number | null };
    }[];
}

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
    const [selectedItemId, setSelectedItemId] = useState<
        string | number | null
    >(null);
    const [isSavingOrder, setIsSavingOrder] = useState(false);
    const [categories, setCategories] = useState<
        { value: string; label: string }[]
    >([]);
    const [isSaving, setIsSaving] = useState(false);
    const {
        values: itemValues,
        setField: setItemField,
        reset: resetItemForm,
    } = useForm({ description: "", categoryId: "" });
    const {
        values: orderValues,
        setField: setOrderField,
        reset: resetOrderForm,
    } = useForm({
        qty: "1",
        price: "",
        status: "",
        vendorId: "",
        purchasedAt: "",
    });
    const addRowRef = useRef<HTMLTableRowElement>(null);

    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);
        try {
            const { id } = await onAdd({
                description: itemValues.description.trim(),
                categoryId: itemValues.categoryId,
            });
            const categoryLabel =
                categories.find((c) => c.value === itemValues.categoryId)
                    ?.label ?? "";
            setLocalItems((prev) => [
                ...prev,
                {
                    id,
                    description: itemValues.description.trim(),
                    total: 0,
                    category: {
                        id: itemValues.categoryId,
                        description: categoryLabel,
                    },
                    orders: [],
                },
            ]);
            setShowAdd(false);
        } catch {
            // mantém a linha aberta para o usuário corrigir
        } finally {
            setIsSaving(false);
        }
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

    useEffect(() => {
        if (!purchaseModalOpen) {
            resetOrderForm();
        }
    }, [purchaseModalOpen, resetOrderForm]);

    const handleSaveOrder = async () => {
        if (!selectedItemId || isSavingOrder) return;
        const qtyNum = parseInt(orderValues.qty, 10);
        const priceNum = parseFloat(orderValues.price);
        setIsSavingOrder(true);
        try {
            const { orderId } = await onAddOrder({
                itemId: String(selectedItemId),
                quantity: qtyNum,
                price: priceNum,
                vendorId: orderValues.vendorId,
                purchasedAt: orderValues.purchasedAt || undefined,
            });
            const vendor = vendors.find((v) => v.id === orderValues.vendorId);
            setLocalItems((prev) =>
                prev.map((i) =>
                    i.id === selectedItemId
                        ? {
                              ...i,
                              orders: [
                                  ...i.orders,
                                  {
                                      id: orderId,
                                      quantity: qtyNum,
                                      price: priceNum,
                                      status:
                                          orderValues.status ||
                                          "pending_payment",
                                      purchasedAt: orderValues.purchasedAt
                                          ? new Date(orderValues.purchasedAt)
                                          : new Date(),
                                      vendor: vendor
                                          ? {
                                                id: vendor.id,
                                                name: vendor.name,
                                                paymentDay: vendor.paymentDay,
                                            }
                                          : {
                                                id: orderValues.vendorId,
                                                name: "",
                                                paymentDay: null,
                                            },
                                  },
                              ],
                          }
                        : i,
                ),
            );
            setPurchaseModalOpen(false);
        } catch {
            // mantém o modal aberto para o usuário corrigir
        } finally {
            setIsSavingOrder(false);
        }
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
                        <TableRow key={item.id}>
                            <TableCell className={styles.noBorderField}>
                                <Input
                                    defaultValue={item.description || ""}
                                    fullWidth
                                />
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
                                <div className={styles.purchases}>
                                    {item.orders?.map((purchase, idx) => (
                                        <div
                                            className={styles.purchaseRow}
                                            key={purchase.id || idx}
                                        >
                                            <div
                                                className={styles.purchaseInfo}
                                            >
                                                <div className={styles.desc}>
                                                    <CardTag>
                                                        {purchase.quantity}x
                                                    </CardTag>{" "}
                                                    <Badge variant="neutral">
                                                        {StatusMap[
                                                            purchase.status
                                                        ] ||
                                                            purchase.status ||
                                                            "—"}
                                                    </Badge>
                                                </div>
                                                <div className={styles.detail}>
                                                    {new Intl.NumberFormat(
                                                        "pt-BR",
                                                        {
                                                            style: "currency",
                                                            currency: "BRL",
                                                        },
                                                    ).format(
                                                        purchase.price,
                                                    )}{" "}
                                                    un. — subtotal{" "}
                                                    {new Intl.NumberFormat(
                                                        "pt-BR",
                                                        {
                                                            style: "currency",
                                                            currency: "BRL",
                                                        },
                                                    ).format(
                                                        purchase.price *
                                                            purchase.quantity,
                                                    )}
                                                </div>
                                            </div>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                className={styles.removeBtn}
                                                aria-label="Remover compra"
                                                title="Remover"
                                                onClick={() => {
                                                    const updated =
                                                        localItems.map((i) =>
                                                            i.id === item.id
                                                                ? {
                                                                      ...i,
                                                                      orders: i.orders.filter(
                                                                          (
                                                                              _: any,
                                                                              filterIdx: number,
                                                                          ) =>
                                                                              filterIdx !==
                                                                              idx,
                                                                      ),
                                                                  }
                                                                : i,
                                                        );
                                                    setLocalItems(updated);
                                                }}
                                            >
                                                <IconX size={14} />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className={styles.addPurchaseBtn}
                                        type="button"
                                        onClick={() => {
                                            setSelectedItemId(item.id);
                                            setPurchaseModalOpen(true);
                                        }}
                                    >
                                        + Adicionar compra
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
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
                                        if (e.key === "Enter") handleSave();
                                    }}
                                />
                            </TableCell>
                            <TableCell>—</TableCell>
                            <TableCell>—</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Modal
                isOpen={purchaseModalOpen}
                onClose={() => setPurchaseModalOpen(false)}
                title="Nova compra"
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                    }}
                >
                    <Select
                        label="Fornecedor"
                        options={[
                            { value: "", label: "Selecione..." },
                            ...vendors.map((v) => ({
                                value: v.id,
                                label: v.name,
                            })),
                        ]}
                        value={orderValues.vendorId}
                        onChange={(e) =>
                            setOrderField("vendorId", e.target.value)
                        }
                        fullWidth
                    />
                    <Input
                        label="Quantidade"
                        value={orderValues.qty}
                        onChange={(e) => setOrderField("qty", e.target.value)}
                        placeholder="Ex: 2"
                    />
                    <Input
                        label="Preço unitário (R$)"
                        value={orderValues.price}
                        onChange={(e) => setOrderField("price", e.target.value)}
                        placeholder="Ex: 22.90"
                    />
                    <Input
                        label="Data de compra"
                        type="date"
                        value={orderValues.purchasedAt}
                        onChange={(e) =>
                            setOrderField("purchasedAt", e.target.value)
                        }
                    />
                    <Select
                        label="Status"
                        options={Object.entries(StatusMap).map(
                            ([value, label]) => ({ value, label }),
                        )}
                        value={orderValues.status}
                        onChange={(e) =>
                            setOrderField("status", e.target.value)
                        }
                        fullWidth
                    />
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 8,
                        }}
                    >
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPurchaseModalOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            isLoading={isSavingOrder}
                            onClick={handleSaveOrder}
                        >
                            Salvar
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
