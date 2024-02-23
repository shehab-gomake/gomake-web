import {useRecoilState} from "recoil";
import {
    IQuickSetupProduct,
    quickSetupCurrentProductIndexState,
    quickSetupProductsState, updatedQuantitiesPriceState
} from "@/widgets/quick-setup-widgets/products/state";
import {
    getQuickSetupProducts,
    updateQuickSetupProductPrice
} from "@/services/api-service/quick-setup/products/products-endpoints";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

const useQuickSetupProducts = () => {
    const [productsIndex, setProductIndex] = useRecoilState(quickSetupCurrentProductIndexState);
    const [products, setProducts] = useRecoilState(quickSetupProductsState);
    const [product, setProduct] = useState<IQuickSetupProduct | undefined>(undefined);
    const [updatedQuantities, setUpdatedQuantities] = useRecoilState(updatedQuantitiesPriceState)
    const {callApi} = useGomakeAxios();
    const {alertFaultUpdate} = useSnackBar();
    const {push} = useRouter();

    useEffect(() => {
        if (products.length > 0 && productsIndex !== null) {
            setProduct(products[productsIndex]);
        }
    }, [products, productsIndex])

    const getProducts = async () => {
        const callBack = (res) => {
            if (res.success) {
                setProducts(res.data);
                setProductIndex(0);
            }
        }
        await getQuickSetupProducts(callApi, callBack);
    }

    const onChange = (quantity: number, price: number) => {
        setUpdatedQuantities(updatedQuantities?.map(q => q?.quantity === quantity ? {quantity, price} : q))
    }

    const onClickNext = async () => {
        const callBack = (res) => {
            if (res.success) {
                if (productsIndex + 1 === products.length) {
                    push('/quick-setup/finish').then();
                } else {
                    setProductIndex(productsIndex + 1);
                }
            } else {
                alertFaultUpdate();
            }
        }
        await updateQuickSetupProductPrice(callApi, callBack, {
            id: product?.id,
            productQuantitiesPricing: updatedQuantities
        })
    }

    const onClickSkip = () => {
        if (productsIndex + 1 === products.length) {
            push('/quick-setup/finish').then();
        } else {
            setProductIndex(productsIndex + 1);
        }
    }

    useEffect(() => {
        getProducts().then();
    }, []);

    useEffect(() => {
        if (product?.quantities) {
            setUpdatedQuantities(product?.quantities?.map(quantity => ({quantity: quantity, price: 0})));
        }
    }, [product]);

    return {
        product,
        products,
        onChange,
        onClickNext,
        updatedQuantities,
        onClickSkip
    }
}

export {useQuickSetupProducts}