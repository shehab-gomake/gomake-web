import {useCallback, useEffect} from "react";
import {useGomakeAxios, useGomakeRouter} from "@/hooks";
import {updateTempUserTokenStorage, updateTokenStorage} from "@/services/storage-data";
import {useRouter} from "next/router";
import {useSearchParams} from "next/navigation";

export default function GuestsWidget() {
    const { callApi } = useGomakeAxios();
    const {navigate} = useGomakeRouter();
    const searchParams = useSearchParams();
    const router = useRouter();
    const getGuestUserToken = async () => {
        if(!router.isReady)
            return;
        const TokenRes: any = await callApi("GET", "/v1/auth/get-guest-user-token");
        if (TokenRes?.success) {
            const userToken = TokenRes?.data?.data?.result?.token;
            if(!userToken){
                navigate("/login");
            }
            updateTokenStorage(userToken);
            debugger;
            const product = router?.query?.product; // searchParams.get('product')
            const ProductRes: any = await callApi("GET", "/v1/printhouse-config/products/get-guest-product?product="+product);
            if (ProductRes?.success) {
                const data = ProductRes?.data?.data?.data;
                if(data && data.productId){
                    navigate(`/products/create?clientTypeId=${data.clientTypeId}&customerId=${data.customerId}&customerName=${data.customerName}&productId=${data.productId}`);
                }
                return;
            }
           //navigate("/home");
        }else{
            navigate("/login");
        }
        return null;
    };
    useEffect(() => {
        getGuestUserToken().then();
    }, [router]);
    return (
        <div>
        </div>
    );
}
