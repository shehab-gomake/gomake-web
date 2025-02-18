import {useCallback, useEffect} from "react";
import {useGomakeAxios, useGomakeRouter} from "@/hooks";
import {updateTempUserTokenStorage, updateTokenStorage} from "@/services/storage-data";

export default function Guests() {
    const { callApi } = useGomakeAxios();
    const {navigate} = useGomakeRouter();
    const getGuestUserToken = useCallback(async () => {
        const TokenRes: any = await callApi("GET", "/v1/auth/get-guest-user-token");
        if (TokenRes?.success) {
            const userToken = TokenRes?.data?.data?.result?.token;
            if(!userToken){
                navigate("/login");
            }
            updateTokenStorage(userToken);
            navigate("/home");
        }else{
            navigate("/login");
        }
        return null;
    }, []);
    useEffect(() => {
        getGuestUserToken().then();
    }, []);  
  return (
      <div>
        
      </div>
  );
}
