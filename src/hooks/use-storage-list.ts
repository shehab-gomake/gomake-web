import { addPrintHouseJobsStorageApi } from "@/services/api-service/board-missions/jobs-storage"
import { useEffect } from "react"
import { getAllPrintHouseJobsStorageApi } from "@/services/api-service/board-missions/jobs-storage"
import { useGomakeAxios } from "./use-gomake-axios";
import { useState } from "react"
import {useRecoilState} from "recoil";
import {selectedMissionsState, storageListState} from "@/widgets/production-floor/state/boards";
import {IBoardMissions} from "@/widgets/production-floor/interfaces/board-missions";

const useStorageList = () => {
    const { callApi } = useGomakeAxios();
    const [storageList, setStorageList] = useRecoilState(storageListState)
  const [inputValue, setInputValue] = useState("")
    const [selectedMission, setSelectedMission] =
        useRecoilState<any>(selectedMissionsState);
  //const [selectedMission, setSelectedMission] = useState<any>({});
  const getAllPrintHouseJobsStorage = async () => {
    const callBack = (res) => {
      if (res.success) {
        setStorageList(res.data)
      }
    }
    await getAllPrintHouseJobsStorageApi(callApi, callBack)
  }
  useEffect(() => {
    if(!storageList){
      setStorageList([])
      getAllPrintHouseJobsStorage()
    }
  }, [storageList])
  const defaultValue = storageList?.find(
    (option: any) => option?.storage === selectedMission?.storage
  )
  const addPrintHouseJobsStorage = async (storage: string) => {
    const callBack = (res) => {
      if (res.success) {
        getAllPrintHouseJobsStorage()
        setStorageList([...storageList, res.data])

      }
    }
    await addPrintHouseJobsStorageApi(callApi, callBack, { storage })
  }
  const handleStorageChange = (e: any, value: any) => {
    setSelectedMission((prevState) => ({
      ...prevState,
      storage: value?.storage,
    }));
  };
    return {
        storageList,
        inputValue,
        defaultValue,
        addPrintHouseJobsStorage,
        handleStorageChange,
        setInputValue,
        selectedMission,
        setSelectedMission
    }
}

export {useStorageList}