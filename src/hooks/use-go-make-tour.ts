import {StepType, useTour} from "@reactour/tour";
import {DependencyList, useEffect} from "react";
import {useRecoilValue} from "recoil";
import {startGuideTourState} from "@/store/tour-state";

const useGoMakeTour = (steps: StepType[], deps?:  DependencyList[]) => {
    const {setIsOpen, setSteps, setCurrentStep} = useTour();
    const startGuid = useRecoilValue(startGuideTourState);

    useEffect(() => {
        setIsOpen(startGuid);
        localStorage.setItem("isHover", startGuid ? "true" : 'false');
        setCurrentStep(0);
        setSteps(steps);
    }, [startGuid, ...deps])

    return {}
};

export {useGoMakeTour}