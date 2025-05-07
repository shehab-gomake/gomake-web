import { useCallback, useEffect } from "react";
import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import {
  updateTempUserTokenStorage,
  updateTokenStorage,
} from "@/services/storage-data";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import {
  connectToStripeApi,
  stripeConnectionSuccessApi
} from "@/services/api-service/print-houses/connect-to-stripe-api";

export default function StripeConnectSuccessWidget() {
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const searchParams = useSearchParams();
  const router = useRouter();

  const connectToStipe = async () => {
    if (!router.isReady) return;
    const callBack = (res) => {
      navigate(`/settings/company-profile?tab=financial`);
    };
    await stripeConnectionSuccessApi(callApi, callBack);
  };

  useEffect(() => {
    connectToStipe().then();
  }, [router]);
  return <div></div>;
}
