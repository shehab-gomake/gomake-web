import { useRecoilState } from "recoil";
import { machineState } from "@/widgets/machines/state/machine-state";

export const useMaterialUtils = () => {
    const [mState, setMachineState] = useRecoilState(machineState);

    const addMaterial = (materialId: string) => {
        setMachineState(prevState => ({
            ...prevState,
            attributes: {
                ...prevState.attributes,
                materials: prevState?.attributes?.materials ? 
                    [...prevState.attributes.materials, materialId] : 
                    [materialId]
            }
        }))
    }
    
    const removeMaterial = (materialId: string) => {
        setMachineState((prevState) => ({
            ...prevState,
            attributes: {
                ...prevState.attributes,
                materials: [...(prevState?.attributes?.materials?.filter(material => material !== materialId) || [])]
            }
        }))
    }

    return {
        addMaterial,
        removeMaterial
    };
};
