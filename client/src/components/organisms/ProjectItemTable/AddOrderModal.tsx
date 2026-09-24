import { useEffect } from "react";
import { Button } from "../../atoms/Button/Button";
import { Input, Select } from "../../atoms/Input/Input";
import { Modal } from "../../atoms/Modal/Modal";
import { useAsyncAction } from "../../../hooks/useAsyncAction";
import { useForm } from "../../../hooks/useForm";
import { StatusMap } from "./ProjectItemTable.mapper";
import styles from "./AddOrderModal.module.css";

import type { OrderDraft } from "./ProjectItemTable.mapper";
import type { Vendor } from "../../../features/projects/model/Vendor";

export function AddOrderModal({
    isOpen,
    vendors,
    onClose,
    onSave,
}: {
    isOpen: boolean;
    vendors: Vendor[];
    onClose: () => void;
    onSave: (input: OrderDraft) => Promise<boolean>;
}) {
    const { isRunning: isSaving, run: runSave } = useAsyncAction();
    const {
        values,
        setField,
        reset,
    } = useForm({
        qty: "1",
        price: "",
        status: "",
        vendorId: "",
        purchasedAt: "",
    });

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    const handleSave = () => {
        void runSave(async () => {
            const saved = await onSave({
                quantity: parseInt(values.qty, 10),
                price: parseFloat(values.price),
                vendorId: values.vendorId,
                status: values.status,
                purchasedAt: values.purchasedAt || undefined,
            });
            if (!saved) return;
            reset();
            onClose();
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nova compra">
            <div className={styles.form}>
                <Select
                    label="Fornecedor"
                    options={[
                        { value: "", label: "Selecione..." },
                        ...vendors.map((v) => ({
                            value: v.id,
                            label: v.name,
                        })),
                    ]}
                    value={values.vendorId}
                    onChange={(e) => setField("vendorId", e.target.value)}
                    fullWidth
                />
                <Input
                    label="Quantidade"
                    value={values.qty}
                    onChange={(e) => setField("qty", e.target.value)}
                    placeholder="Ex: 2"
                />
                <Input
                    label="Preço unitário (R$)"
                    value={values.price}
                    onChange={(e) => setField("price", e.target.value)}
                    placeholder="Ex: 22.90"
                />
                <Input
                    label="Data de compra"
                    type="date"
                    value={values.purchasedAt}
                    onChange={(e) =>
                        setField("purchasedAt", e.target.value)
                    }
                />
                <Select
                    label="Status"
                    options={Object.entries(StatusMap).map(
                        ([value, label]) => ({ value, label }),
                    )}
                    value={values.status}
                    onChange={(e) => setField("status", e.target.value)}
                    fullWidth
                />
                <div className={styles.footer}>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        isLoading={isSaving}
                        onClick={handleSave}
                    >
                        Salvar
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
