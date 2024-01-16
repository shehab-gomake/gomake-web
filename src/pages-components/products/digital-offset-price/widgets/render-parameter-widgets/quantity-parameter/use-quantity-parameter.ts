import {useRecoilState, useRecoilValue} from "recoil";
import {productTypesNumberState} from "@/store";
import {
    openQuantityComponentModalState
} from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/state";

const useQuantityParameter = () => {
    const [openModal, setOpenModal] = useRecoilState<boolean>(openQuantityComponentModalState);
    const productTypesNumber = useRecoilValue<number>(productTypesNumberState);


    return {
        openModal,
        setOpenModal,
        productTypesNumber
    }
}

export {useQuantityParameter}