import {useGoMakeSignalr} from "@/hooks/signalr/use-go-make-signalr";
import {getUserToken} from "@/services/storage-data";
import config from "@/config";
import {useEffect} from "react";

const useDisplayProfitProfilesSignalr = ({getAllProfitProfileProductByProductId,selectedPricingProfileSetting}:{getAllProfitProfileProductByProductId:any,selectedPricingProfileSetting:any}) => {
    const {connection,} = useGoMakeSignalr<any[]>({
        url: config.erp_server + '/hubs/displayProfitProfiles',
        accessToken: getUserToken(),
        methodName: ""
    })
    useEffect(() => {
        if (connection) {
            connection.on("Show", () => {
                if(selectedPricingProfileSetting?.productId){
                    getAllProfitProfileProductByProductId(selectedPricingProfileSetting?.productId)
                }
            });
        }
    }, [connection]);
    return {}
};
export {useDisplayProfitProfilesSignalr}

