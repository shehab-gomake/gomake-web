import { useGomakeAxios } from "@/hooks"
import { boardMissionMaterialState } from "./states";
import { useRecoilState } from "recoil";
import { addPrintHouseJobsStorageApi, getAllPrintHouseJobsStorageApi } from "@/services/api-service/board-missions/jobs-storage";
import { useEffect, useState } from "react";

const useMaterialAndProductionTimeModal = ({onUpdate,onClose}) => {
    const {callApi} = useGomakeAxios();

    const [state, setState] = useRecoilState<any>(boardMissionMaterialState);
    const [storageList,setStorageList] = useState([])
    const [inputValue,setInputValue] = useState("")
    console.log("storageList",storageList)
  const convertMinutesToSeconds = (minutes: number) => minutes * 60;
  const convertSecondsToMinutes = (seconds: string | number) =>
    Math.floor(Number(seconds) / 60);

  const handleMaterialChange = (index: number, newValue: string) => {
    setState((prevState) => ({
      ...prevState,
      materials: prevState?.materials.map((item, idx) =>
        idx === index ? { ...item, currentValue: newValue } : item
      ),
    }));
  };

  const handleUpdate = (isSendingMessage?: boolean | null) => {
    onUpdate(state, isSendingMessage);
    onClose();
  };

  const handleProductionTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValueInMinutes = parseInt(event.target.value, 10);

    if (!isNaN(newValueInMinutes)) {
      setState((prevState) => ({
        ...prevState,
        productionTime: convertMinutesToSeconds(newValueInMinutes), // Store in seconds
      }));
    }
  };
  const handleStorageChange = (e: any, value: any) => {
    setState((prevState) => ({
      ...prevState,
      storage: value?.storage,
    }));
  };
    const getAllPrintHouseJobsStorage = async () => {
        const callBack = (res) => {
            if(res.success){
              setStorageList(res.data)
            }
        }
        await getAllPrintHouseJobsStorageApi(callApi,callBack)
    }
    useEffect(() => {
        getAllPrintHouseJobsStorage()
    }, [])

    const addPrintHouseJobsStorage = async (storage:string) => {
        const callBack = (res) => {
            if(res.success){
              getAllPrintHouseJobsStorage()
                setStorageList([...storageList,res.data])

            }
        }
        await addPrintHouseJobsStorageApi(callApi,callBack,{storage})
    }
    return {
        handleMaterialChange,
        handleUpdate,
        handleProductionTimeChange,
        convertSecondsToMinutes,
        state,
        storageList,
        inputValue,
        setInputValue,
        handleStorageChange,
        addPrintHouseJobsStorage
    }
}

export {useMaterialAndProductionTimeModal}