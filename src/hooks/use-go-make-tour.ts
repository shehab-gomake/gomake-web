import { StepType, useTour } from "@reactour/tour";
import { DependencyList, useEffect } from "react";
import { useRecoilState } from "recoil";
import { hoverStatusState } from "@/store";
import { navStatusState } from "@/store/nav-status";

const useGoMakeTour = (steps: StepType[], deps?: DependencyList[]) => {
  const { setIsOpen, setSteps, setCurrentStep } = useTour();
  const [, setIsHover] = useRecoilState(hoverStatusState);
  const [, setNavStatus] = useRecoilState(navStatusState);

  useEffect(() => {
    setIsOpen(false);
    setCurrentStep(0);
    setSteps(steps);
  }, [...deps]);

  const beforeOpenGoMakeTour = () => {
    return new Promise((resolve, reject) => {
      setIsHover(true);
      setNavStatus({ isClosed: false });
      localStorage.setItem("isHover", "true");
      setTimeout(() => {
        resolve({});
      }, 1000);
    });
  };

  const startGoMakeTour = () => {
    beforeOpenGoMakeTour().then(() => {
      setIsOpen(true);
      setCurrentStep(0);
    });
  };
  const onClickHelpButton = () => {
    startGoMakeTour();
  };

  return {
    onClickHelpButton,
    setIsOpen,
  };
};

export { useGoMakeTour };
