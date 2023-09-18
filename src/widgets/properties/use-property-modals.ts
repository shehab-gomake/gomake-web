import { useState } from "react";

const usePropertiesModals = () => {
    const [openAddNewModalRule, setOpenAddNewModalRule] = useState(false);

    const onOpenAddNewModalRule = () => {
        setOpenAddNewModalRule(true);
    };

    const onCloseAddNewModalRule = () => {
        setOpenAddNewModalRule(false);
    };


    return {
        openAddNewModalRule,
        onOpenAddNewModalRule,
        onCloseAddNewModalRule
    }
}

export {usePropertiesModals}