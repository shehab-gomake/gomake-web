import {useRecoilState} from "recoil";
import {machinesSetup, selectedMachinesSetup} from "@/widgets/quick-setup-widgets/machines/state";
import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {useCallback, useEffect, useState} from "react";

const useMachinesSetup = () => {
  const [adminMachines, setAdminMachines] = useRecoilState(machinesSetup);
  const [printHouseMachines, setPrintHouseMachines] = useRecoilState(selectedMachinesSetup);
  const [searchText, setSearchText] = useState<string>('');
  const addMachinesToPrintHouseMachine = () => {
    setPrintHouseMachines(printHouseMachines.concat(adminMachines.filter(a => a.checked)).map(item => ({
      ...item,
      checked: false
    })));
    setAdminMachines(adminMachines.filter(a => !a.checked));
  }

  const onSelectAdminMachine = (machineId: string) => {
    setAdminMachines(adminMachines.map(machine => machine.id === machineId ? {...machine, checked: !machine.checked} : machine))
  }
  const onSelectPrintHouseMachine = (machineId: string) => {
    setPrintHouseMachines(printHouseMachines.map(machine => machine.id === machineId ? {...machine, checked: !machine.checked} : machine))
  }
  const categoryMachines = useCallback((categoryId: ECategoryId) => {
    return adminMachines?.filter(machine => searchText ? machine.category === categoryId && machine.name?.toLowerCase()?.includes(searchText.toLowerCase()) : machine.category === categoryId)
  }, [adminMachines, searchText])
  const removeMachinesFromPrintHouse = () => {
    setAdminMachines(adminMachines.concat(printHouseMachines.filter(a => a.checked)).map(item => ({...item, checked: false})));
    setPrintHouseMachines(printHouseMachines.filter(a => !a.checked).map(item => ({...item, checked: false})));
  }
  useEffect(() => {
    setSearchText('');
  }, [adminMachines])
  return {
    adminMachines,
    printHouseMachines,
    addMachinesToPrintHouseMachine,
    removeMachinesFromPrintHouse,
    categoryMachines,
    onSelectAdminMachine,
    onSelectPrintHouseMachine,
    setSearchText,
    searchText
  }
}
export {useMachinesSetup}