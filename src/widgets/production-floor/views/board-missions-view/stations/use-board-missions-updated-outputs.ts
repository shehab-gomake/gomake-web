import { useState } from "react"
import { useRecoilValue } from "recoil"
import { boardMissionsStationsState } from "./state"
import { getEmployeesByActionIdApi, getMachineByActionIdNewApi } from "@/services/api-service/customers/employees-api"
import { getMaterialsSizesApi } from "@/services/api-service/materials/printhouse-materials-endpoints"
import { useGomakeAxios } from "@/hooks"

const useBoardMissionsUpdatedOutputs = () => {
    const {callApi} = useGomakeAxios();
    const [employeesList,setemployeesList]=useState([])
    const [machinesList,setMachinesList]=useState([])
    const [materialsList,setMaterialsList]=useState([])
    const actions = useRecoilValue(boardMissionsStationsState);
    const onClickGetEmployeeForAction = async (actionId) => {
        const callBack = (res) => {
          if (res.success) {
            const employeeList = res.data.map((data) => ({
                label: data.name,
                value: data.id,
              }));
            setemployeesList(employeeList)
          }
          else{
            setemployeesList([]) 
          }
        };
        await getEmployeesByActionIdApi(callApi, callBack, { ActionId: actionId });
      };

      const onClickGetMachineForAction = async (actionId) => {
        const callBack = (res) => {
          if (res.success) {
            const machinesList = res.data.map((data) => ({
                label: data.name,
                value: data.id,
              }));
              setMachinesList(machinesList)
          }
          else{
            setMachinesList([]) 
          }
        };
        await getMachineByActionIdNewApi(callApi, callBack, { actionId });
      }

      const onClickGetMaterialsForAction = async (materials) => {
        const callBack = (res) => {
            if (res.success) {
                const materialList = res.data.map((data) => ({
                    label: data.name,
                    value: data.id,
                  }));
                  setMaterialsList(materialList)
            }
            else{
                setMaterialsList([])
            }
        }
            await getMaterialsSizesApi(callApi, callBack, {
               ...materials?.printingMaterialInfo
            })
        
    }


    return {
        employeesList,
        machinesList,
        materialsList,
        onClickGetEmployeeForAction,
        onClickGetMachineForAction,
        onClickGetMaterialsForAction
    }
}

export {useBoardMissionsUpdatedOutputs}