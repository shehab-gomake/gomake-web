import Menu, { MenuProps } from "@mui/material/Menu";
import { IMachineList } from "@/widgets/machine-list/interface";
import { styled } from "@mui/material/styles";
import { useGomakeMachines } from "@/hooks";
import { ActionsListComponent } from "@/widgets/production-floor/filters/select/actions-select/action-list-select-component";
import { Source } from "@/widgets/production-floor/filters/select/actions-select/use-actions-list";
import { IStation } from "@/widgets/production-floor/interfaces/filters";
import { useEffect } from "react";

const MachineList = ({}: IMachineList) => {
  const { setMachines, getMachinesList } = useGomakeMachines();

  const onUpdateMachines = (stations: IStation[]) => {
    const machinesIds = stations.flatMap((station) => station.machineIds);
    setMachines((prevState) =>
      prevState.map((m) => ({ ...m, checked: machinesIds.includes(m.id) }))
    );
  };

  //!here
  useEffect(() => {
    getMachinesList();
  }, []);

  return (
    <ActionsListComponent
      source={Source.DASHBOARD}
      onClickApply={onUpdateMachines}
    />
  );
};

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(() => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    width: "250px",
    // height: 500,
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      fontSize: "12px",
      color: "#12133A",
      padding: 0,
    },
    "& .MuiFormControlLabel-root": {
      margin: 0,
    },
  },
}));

export { MachineList, StyledMenu };
