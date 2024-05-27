import {StepType, useTour} from "@reactour/tour";
import {DependencyList, useEffect} from "react";
import {useRecoilState} from "recoil";
import {startGuideTourState} from "@/store/tour-state";
import {hoverStatusState} from "@/store";
import {navStatusState} from "@/store/nav-status";

const useGoMakeTour = (steps: StepType[], deps?: DependencyList[]) => {
    const {setIsOpen, setSteps, setCurrentStep} = useTour();
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
            setNavStatus({isClosed: false});
            localStorage.setItem("isHover", "true");
            setTimeout(() => {
                resolve({});
            }, 1000);
        })
    }

    const startGoMakeTour = () => {
        beforeOpenGoMakeTour().then(() => {
            setIsOpen(true);
            setCurrentStep(0);
        });
    }
    const onClickHelpButton = () => {
        startGoMakeTour();
    }

    // useEffect(() => {
    //     if (isOpen) {
    //         setIsHover(true);
    //         setNavStatus({ isClosed: false });
    //         localStorage.setItem("isHover", "true");
    //     } else {
    //          setIsHover(false);
    //         setNavStatus({ isClosed: true });
    //         localStorage.setItem("isHover", "false");
    //     }
    // }, [isOpen])
    return {
        onClickHelpButton,
        setIsOpen
    }
};

export {useGoMakeTour}