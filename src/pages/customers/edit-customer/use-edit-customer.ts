import { useCallback, useMemo, useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useRecoilState } from "recoil";
import { loadingWithShadowState } from "@/store";

const useEditCustomer = () => {
  const { callApi } = useGomakeAxios();
  const [state, setState] = useState<any>({});
  const {alertFaultUpdate, alertSuccessUpdate } = useSnackBar();
  const [loading,setLoading] = useRecoilState(loadingWithShadowState);

  const editCustomer = useCallback(
    async (data: any, setData: any) => {
      setLoading(true)
      return new Promise(async (resolve, reject) => {
        try {
            const res = await callApi("PUT", `/v1/customers/update-customer`, {
              customer: data,
            });
            if (res?.success) {
              alertSuccessUpdate();
              resolve(true);
              setLoading(false)
            } else {
              alertFaultUpdate();
              reject("API call failed");
              setLoading(false)
            }
          
        } catch (error) {
          console.error("Error editing customer:", error);
          reject(error);
        }
      });
    },
    [state]
  );


  return {
    state,
    editCustomer,
  };
};

export { useEditCustomer  };