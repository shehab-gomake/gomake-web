import {useRecoilState, useRecoilValue} from "recoil";
import {productSetsParamState, productTypesNumberState} from "@/store";
import {
    openQuantityComponentModalState
} from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/state";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const useQuantityParameter = () => {
    const { t } = useTranslation();
    const [openModal, setOpenModal] = useRecoilState<boolean>(openQuantityComponentModalState);
    const productTypesNumber = useRecoilValue<number>(productTypesNumberState);
    const productSetsParam = useRecoilValue<string>(productSetsParamState);

    return {
        openModal,
        setOpenModal,
        productTypesNumber,
        productSetsParam,t
    }
}

export {useQuantityParameter}