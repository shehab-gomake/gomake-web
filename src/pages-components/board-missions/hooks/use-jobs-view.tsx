import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { userProfileState } from "@/store/user-profile";

type ViewType = "table" | "cards";

const useJobsView = () => {
  const router = useRouter();
  const userProfile = useRecoilValue(userProfileState);

  const currentView = useMemo<ViewType>(() => {
    const viewParam = router.query.view as string;

    // If view param is explicitly set, use it
    if (viewParam === "cards" || viewParam === "table") {
      return viewParam;
    }
    // Default to "cards" if user has no EmployeeId, otherwise "table"
    const hasEmployeeId =
      userProfile?.employeeId && userProfile.employeeId.trim() !== "";
    return hasEmployeeId ? "table" : "cards";
  }, [router.query.view, userProfile?.employeeId]);

  const setView = useCallback(
    (view: ViewType) => {
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            view,
          },
        },
        undefined,
        { shallow: true }
      );
    },
    [router]
  );

  return {
    currentView,
    setView,
  };
};

export { useJobsView };
