import { IActionMachines } from "../../../state/actions-list";

export interface EditGroupModalProps {
  openModalEditGroup: boolean;
  onClickCloseModalEditGroup: () => void;
  handleCloseMenu: () => void;
  selectedGroupId?: any;
  actions: IActionMachines[];
  getStationFilterGroups: () => void;
  setFilters?: any;
}

export interface UseEditGroupModalProps {
  selectedGroupId?: any;
  actions: IActionMachines[];
  getStationFilterGroups: () => void;
  setFilters?: any;
}
