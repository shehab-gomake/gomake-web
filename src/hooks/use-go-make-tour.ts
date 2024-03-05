import {StepType, useTour} from "@reactour/tour";
import {DependencyList, useEffect} from "react";

const useGoMakeTour = (steps: StepType[], deps?:  DependencyList[]) => {
    const {setIsOpen, setSteps, setCurrentStep} = useTour();

    useEffect(() => {
        setIsOpen(true);
        setSteps(steps);
        setCurrentStep(0);
        localStorage.setItem("isHover", "true");
        return () => {
            setIsOpen(false)
            localStorage.setItem("isHover", "false");
        }
    }, deps);
    return {}
};

export {useGoMakeTour}