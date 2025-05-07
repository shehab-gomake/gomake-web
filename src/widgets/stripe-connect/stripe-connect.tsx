import { useCallback, useEffect } from "react";
import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import {
  updateTempUserTokenStorage,
  updateTokenStorage,
} from "@/services/storage-data";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import {connectToStripeApi} from "@/services/api-service/print-houses/connect-to-stripe-api";

export default function StripeConnectWidget() {
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const searchParams = useSearchParams();
  const router = useRouter();

  const connectToStipe = async () => {
    if (!router.isReady) return;
    const callBack = (res) => {
      if (res.success) {
        const url = res.data;
        if (url) {
          window.location.href = url;
        } else {
          console.error("Received an invalid URL from the API.");
        }
      }
    };
    await connectToStripeApi(callApi, callBack);
  };

  useEffect(() => {
    connectToStipe().then();
  }, [router]);
  return <div></div>;
}
