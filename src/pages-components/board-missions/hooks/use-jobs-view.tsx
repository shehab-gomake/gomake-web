import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

type ViewType = "table" | "cards";

const useJobsView = () => {
  const router = useRouter();

  const currentView = useMemo<ViewType>(() => {
    const viewParam = router.query.view as string;
    if (viewParam === "cards") {
      return "cards";
    }
    // Default to "table" if no param or invalid value
    return "table";
  }, [router.query.view]);

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
