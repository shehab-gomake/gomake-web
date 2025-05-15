import { addPrintHouseJobsStorageApi } from "@/services/api-service/board-missions/jobs-storage"
import { useEffect } from "react"
import { getAllPrintHouseJobsStorageApi } from "@/services/api-service/board-missions/jobs-storage"
import { useGomakeAxios } from "./use-gomake-axios";
import { useState } from "react"

const useStorageList = ({selectedMission,setSelectedMission}) => {
    const { callApi } = useGomakeAxios();
    const [storageList, setStorageList] = useState([])
  const [inputValue, setInputValue] = useState("")
  const getAllPrintHouseJobsStorage = async () => {
    const callBack = (res) => {
      if (res.success) {
        setStorageList(res.data)
      }
    }
    await getAllPrintHouseJobsStorageApi(callApi, callBack)
  }
  useEffect(() => {
    if(storageList.length === 0){
      console.log("{getAllPrintHouseJobsStorage,}",storageList)
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
        setInputValue
    }
}

export {useStorageList}