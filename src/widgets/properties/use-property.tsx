import { useTranslation } from "react-i18next";
import { usePropertiesModals } from "./use-property-modals";

const useProperty = () => {
    const { t } = useTranslation();
    const { onOpenAddNewModalRule, onCloseAddNewModalRule} = usePropertiesModals();
    return{
        onOpenAddNewModalRule,
        onCloseAddNewModalRule
    }
}

export {useProperty}
