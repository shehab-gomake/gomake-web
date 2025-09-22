import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import { printHouseProfile } from "@/store/print-house-profile";

const useTrialRedirect = () => {
  const router = useRouter();
  const printHouseProfileState = useRecoilValue(printHouseProfile);

  useEffect(() => {
    // Check if trial is finished and we're not already on the subscriptions page
    if (
      printHouseProfileState?.trialFinished &&
      router.pathname !== "/settings/subscriptions"
    ) {
      // Redirect to subscriptions page
      router.push("/settings/subscriptions");
    }
  }, [printHouseProfileState?.trialFinished, router.pathname, router]);

  return {
    isTrialFinished: printHouseProfileState?.trialFinished,
    isOnSubscriptionsPage: router.pathname === "/settings/subscriptions",
  };
};

export { useTrialRedirect };
