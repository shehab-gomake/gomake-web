import { useState } from "react";

const useFinancesHeaderWidget = () => {
    const [openModal, setOpenModal] = useState<boolean>(false)
    const onClose = () => {
        setOpenModal(false);
    }
    const onOpen = () => {
        setOpenModal(true)
    }
    return {
        openModal, onClose, onOpen
    };
};

export { useFinancesHeaderWidget };
