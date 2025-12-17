import React, { SyntheticEvent, useState } from "react";
import { useTableCellData } from "@/widgets/materials-widget/components/table-cell-data/use-table-cell-data";
import { GoMakeAutoComplate, GoMakeDeleteModal } from "@/components";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { materialCategorySuppliersState } from "../../state";
import { ModalType } from "@/enums";

interface IProps {
    parameterKey: string;
    values: any[];
    id: string;
    value: any; // Can be string, array, or object
    isAdmin: boolean;
    options: { label: string; value: string }[];
    placeHolder?: string;
    isInventoryTable?: boolean;
    isPurchasePricingTable?: boolean;
    listClient?: any[];
    checkWhatRenderArrayCustomer?: (e: any) => void;
}

const SelectClientsInput = ({
    values,
    parameterKey,
    id,
    value,
    isAdmin,
    options,
    placeHolder,
    isInventoryTable = false,
    isPurchasePricingTable = false,
    listClient,
    checkWhatRenderArrayCustomer
}: IProps) => {
    const { updateCellData } = useTableCellData(isAdmin, isInventoryTable, isPurchasePricingTable);

    const { t } = useTranslation();
    const materialSuppliers = useRecoilValue(materialCategorySuppliersState);
    const isHaveMorethanMaterialSuppliers = materialSuppliers?.length > 1;
    const [openDeleteTableRowModal, setOpenDeleteTableRowModal] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<any>();

    const onClickCloseDeleteTableRowModal = () => {
        setOpenDeleteTableRowModal(false);
    };

    const onClickOpenDeleteTableRowModal = () => {
        setOpenDeleteTableRowModal(true);
    };

    const clientsOptions = listClient?.map((client) => ({
        value: client.id,
        label: `${client.name} - ${client.code || ''}`,
    }));

    // Extract current selected client ID from the value
    const getCurrentClientId = () => {
        if (!value) return "";

        // If value is an array (like clients: [{id: "...", name: "..."}])
        if (Array.isArray(value) && value.length > 0) {
            return value[0].id || value[0];
        }

        // If value is a string ID
        if (typeof value === "string") {
            return value;
        }

        // If value is an object with id
        if (typeof value === "object" && value.id) {
            return value.id;
        }

        return "";
    };

    const currentClientId = getCurrentClientId();

    const onSelectChange = async (event: SyntheticEvent, selectedOption: any) => {
        setSelectedValue(selectedOption);

        const valueToSend = isInventoryTable || isPurchasePricingTable
            ? [selectedOption?.value]
            : selectedOption?.value || "";

        await updateCellData(id, parameterKey, valueToSend);

        // if (isHaveMorethanMaterialSuppliers) {
        //     onClickOpenDeleteTableRowModal();
        // } else {
        //     // For inventory/purchase tables, send as array format to match expected structure
        //     const valueToSend = isInventoryTable || isPurchasePricingTable
        //         ? [selectedOption?.value]
        //         : selectedOption?.value || "";

        //     await updateCellData(id, parameterKey, valueToSend);
        // }
    };

    return (
        <div
            style={{
                padding: "0px 20px 0px 20px",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                width: "100%",
            }}
        >
            <GoMakeAutoComplate
                key={clientsOptions.find((x) => x.value === currentClientId)?.label || `${parameterKey}_${currentClientId}`}
                onChange={onSelectChange}
                onChangeTextField={parameterKey === "clients" ? checkWhatRenderArrayCustomer : undefined}
                placeholder={
                    currentClientId ? clientsOptions.find((x) => x.value === currentClientId)?.label : placeHolder || t("materials.selectClient", "Select a client")
                }
                value={currentClientId ? clientsOptions.find((x) => x.value === currentClientId)?.label : undefined}
                style={{
                    border: 0,
                    minWidth: 180,
                }}
                options={clientsOptions}
                isOptionEqualToValue={(option: any, value: any) => String(option?.value) === String(value?.value)}
            />
            <GoMakeDeleteModal
                modalType={ModalType.EDIT}
                openModal={openDeleteTableRowModal}
                onClose={onClickCloseDeleteTableRowModal}
                hideIcon
                title={t("materials.modals.updateModalTitle")}
                yesBtn={t("documentingSettings.update")}
                onClickDelete={async () => {
                    // For inventory/purchase tables, send as array format to match expected structure
                    const valueToSend = isInventoryTable || isPurchasePricingTable
                        ? [selectedValue?.value]
                        : selectedValue?.value || "";

                    await updateCellData(id, parameterKey, valueToSend);
                }}
            />
        </div>
    );
};

export { SelectClientsInput };
