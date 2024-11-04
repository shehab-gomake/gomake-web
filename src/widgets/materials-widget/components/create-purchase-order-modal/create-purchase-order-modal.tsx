import * as React from "react";
import { useTranslation } from "react-i18next";
import { GoMakeDeleteModal } from "@/components";
import { useRecoilState, } from "recoil";
import { openCreatePurchaseOrderModalState } from "../../state";
import { useMaterialsActions } from "../actions-menu/use-materials-actions";

interface IAddRowModalProps {
    isAdmin: boolean;
}
const CreatePurchaseOrderModal = (props: IAddRowModalProps) => {
    const { t } = useTranslation();
    const [openModal, setOpenModal] = useRecoilState<boolean>(openCreatePurchaseOrderModalState);
    const { CreatePurchaseOrder } = useMaterialsActions(props?.isAdmin)
    return (
        <GoMakeDeleteModal
            title={t("documentingSettings.createPurchaseOrderModalTitle")}
            yesBtn={t("sales.quote.Confirm")}
            openModal={openModal}
            onClose={() => { setOpenModal(false) }}
            hideIcon
            onClickDelete={() => CreatePurchaseOrder().then()}
        />

    );
};

export { CreatePurchaseOrderModal };