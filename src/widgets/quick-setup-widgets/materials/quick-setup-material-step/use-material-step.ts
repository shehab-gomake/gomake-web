import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {
    IQuickSetupMaterialsStep,
    quickSetupMaterialSteps
} from "@/widgets/quick-setup-widgets/materials/quick-setup-material-step/steps";
import {useRecoilValue} from "recoil";

const useMaterialStep = () => {
    const [step, setStep] = useState<IQuickSetupMaterialsStep>({
        parameters: [],
        stepTitle: ''
    } as IQuickSetupMaterialsStep);
    const [state, setState] = useState<Record<string, number>>({});
    const {query} = useRouter();
    const {materialStep} = query;
    const onChange = (key, value) => {
        setState({
            ...state,
            [key]: value
        })
    }
    useEffect(() => {
        const steps = ['1', '2', '3'];
        if (steps.includes(materialStep?.toString())) {
            const currentStep = quickSetupMaterialSteps(materialStep?.toString());
            setStep(currentStep);
            setState({});
        } else {

        }
    }, [materialStep])
    useEffect(() => {
        console.log(state)
    }, [state])
    return {
        step,
        onChange,
        state
    }
}
export {useMaterialStep}