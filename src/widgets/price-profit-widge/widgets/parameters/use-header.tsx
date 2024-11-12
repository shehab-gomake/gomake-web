import { useState } from "react";

const useFinancesHeaderWidget = () => {
    const [openModal, setOpenModal] = useState<boolean>(false)
    const onClose = () => {
        setOpenModal(false);
    }
    const onOpen = () => {
        setOpenModal(true)
    }

    const [openFinancialModal, setOpenFinancialModal] = useState<boolean>(false)
    const onCloseFinancialModal = () => {
        setOpenFinancialModal(false);
    }
    const onOpenFinancialModal = () => {
        setOpenFinancialModal(true)
    }

    return {
        openModal,
        onClose,
        onOpen,
        openFinancialModal,
        onCloseFinancialModal,
        onOpenFinancialModal
    };
};

export { useFinancesHeaderWidget };
