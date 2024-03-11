import {useRecoilState, useRecoilValue} from "recoil";
import {
    IQuickSetupProduct,
    quickSetupProductsState, updatedQuantitiesPriceState
} from "@/widgets/quick-setup-widgets/products/state";
import {
    getQuickSetupProducts,
    updateQuickSetupProductPrice
} from "@/services/api-service/quick-setup/products/products-endpoints";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useCallback, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {quickSetupUpdateNextStep} from "@/services/api-service/quick-setup/next-step/update-next-step-endpoint";
import {systemCurrencyState} from "@/store";
import {currenciesState} from "@/widgets/materials-widget/state";
import {getCurrenciesApi} from "@/services/api-service/enums/enums-endpoints";

const useQuickSetupProducts = () => {
    const [products, setProducts] = useRecoilState(quickSetupProductsState);
    const [product, setProduct] = useState<IQuickSetupProduct | undefined>(undefined);
    const [updatedQuantities, setUpdatedQuantities] = useRecoilState(updatedQuantitiesPriceState);
    const [loading, setLoading] = useState<boolean>(false);
    const {callApi} = useGomakeAxios();
    const {alertFaultUpdate} = useSnackBar();
    const {push, query} = useRouter();
    const {productIndex} = query;
    const systemCurrency = useRecoilValue<any>(systemCurrencyState);
    const [currencies, setCurrencies] = useRecoilState(currenciesState);
    const getCurrencies = async () => {
        const callBack = (res) => {
            if (res.success) {
                setCurrencies(res.data?.map(currency => ({label: currency.text, value: currency.value})));
            }
        }
        await getCurrenciesApi(callApi, callBack)
    }
    const currency = useCallback(() => {
        return currencies?.find(c => c.value === systemCurrency)?.label
    }, [currencies, systemCurrency]);

    useEffect(() => {
        if (products.length > 0) {
            setProduct(products[+productIndex - 1]);
        }
    }, [products, productIndex])

    const getProducts = async () => {
        const callBack = (res) => {
            if (res.success) {
                setProducts(res.data);
                setLoading(false);
            }
        }
        setLoading(true)
        await getQuickSetupProducts(callApi, callBack);
    }

    const onChange = (quantity: number, price: number) => {
        setUpdatedQuantities(updatedQuantities?.map(q => q?.quantity === quantity ? {quantity, price} : q))
    }

    const onClickNext = async () => {
        const callBack = (res) => {
            if (res.success) {
                    push(res.data?.nextStepUrl).then();

            } else {
                alertFaultUpdate();
            }
        }
        await updateQuickSetupProductPrice(callApi, callBack, {
            id: product?.id,
            productQuantitiesPricing: updatedQuantities,
            nextStepUrl: +productIndex === products?.length ? '/quick-setup/finish' : `/quick-setup/products/${+productIndex + 1}`
        })
    }

    const onClickSkip = async () => {
        const callBack = (res) => {
            if (res.success) {
                push(res.data?.nextStepUrl).then();

            } else {
                alertFaultUpdate();
            }
        }
        await quickSetupUpdateNextStep(callApi, callBack, {
            nextStepUrl: +productIndex === products?.length ? '/quick-setup/finish' : `/quick-setup/products/${+productIndex + 1}`,
            isFinalStep: false
        })
    }

    useEffect(() => {
        getProducts().then();
        getCurrencies().then();
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
        onClickSkip,
        currency,
        loading
    }
}

export {useQuickSetupProducts}