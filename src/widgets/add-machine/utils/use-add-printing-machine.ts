import {useCallback, useMemo, useState} from "react";
import {basicInputs} from "@/widgets/add-machine/utils/inputs/basic-inputs";
import {speedInputs} from "@/widgets/add-machine/utils/inputs/speed-inputs";
import {feedersStackersInputs} from "@/widgets/add-machine/utils/inputs/feeders-stackers-inputs";
import {colorsInputs} from "@/widgets/add-machine/utils/inputs/colors-inputs";
import {beatsInputs} from "@/widgets/add-machine/utils/inputs/beats-inputs";
import {mediaSettingsInputs} from "@/widgets/add-machine/utils/inputs/media-settings-inputs";
import {IInput} from "@/widgets/add-machine/interface/inputs-interfaces";

const useAddPrintingMachine = () => {
    const [state, setState] = useState<Record<string, any>>({
        currency: 1,
        resolution: 1,
        insertOption: false,
        doubleHead: false,
        basicsColors: 1,
        printLayersSameRun: false,
        printLayers: false,
        coatingUnit: false
    });
    const [errors, setErrors] = useState<{ [name: string]: boolean }>({});

    const onClickAddMachine = useCallback(() => {
        let hasError: boolean = false;
        if (!hasError) {
            console.log(state);
        }
    }, [state, errors]);


    const changeState = useCallback(
        (key: string, value: any) => {
            setState({...state, [key]: value});
        },
        [state]
    );

    const machineBasicProps = useMemo(() => basicInputs(state), [state]);
    const machineMediaSettingProps = useMemo(() => mediaSettingsInputs(state), [state]);
    const machineSpeedProps = useMemo(() => speedInputs(state), [state]);
    const machineFeedersStackersProps = useMemo(() => feedersStackersInputs(state), [state]);
    const machineColorsProps = useMemo(() => colorsInputs(state), [state]);
    const machineBeatsProps = useMemo(() => beatsInputs(state), [state]);

    const isValidStep = useCallback((inputs: IInput) => {
        let hasError: boolean = false;
        const errorsObj: Record<string, boolean> = {};
        for (const input of machineBasicProps) {
            if (input.required) {
                if (!state[input.key]) {
                    hasError = true;
                    errorsObj[input.key] = true;
                }
            }
        }
        setErrors({...errors, ...errorsObj});
        if (!hasError) {
            console.log(state);
        }
        return !hasError;

    }, [state, errors]);


    return {
        changeState,
        errors,
        onClickAddMachine,
        machineBasicProps,
        machineMediaSettingProps,
        machineSpeedProps,
        machineFeedersStackersProps,
        machineColorsProps,
        machineBeatsProps
    };
};

export {useAddPrintingMachine};