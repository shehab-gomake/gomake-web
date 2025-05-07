import { useCallback, useEffect } from "react";
import { useGomakeAxios, useGomakeRouter } from "@/hooks";

import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import {
  stripePaymentSuccess
} from "@/services/api-service/print-houses/connect-to-stripe-api";

export default function StripePaymentSuccessWidget() {
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const searchParams = useSearchParams();
  const router = useRouter();

  const connectToStipe = async () => {
    if (!router.isReady) return;
    const recordId = router?.query?.recordId;
    const callBack = (res) => {
      if (res?.success) {
        debugger
        const response = res?.data;
        if(response){
          navigate(`/orders?finalPatternSearch=${response.number}`);
        }
      }
    };
    await stripePaymentSuccess(callApi, callBack,recordId);
  };

  useEffect(() => {
    connectToStipe().then();
  }, [router]);
  return <div>
    payment success
  </div>;
}
