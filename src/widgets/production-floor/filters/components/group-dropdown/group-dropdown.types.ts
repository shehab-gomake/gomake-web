import { IFilterGroupsList } from "../../../interfaces/borad-missions-filter-groups";

export interface GroupDropdownComponentProps {
  filterGroups: IFilterGroupsList[];
  selectedGroupId: string;
  handleSelectGroup: (groupId: string) => void;
  handleClickMenu: (e: React.MouseEvent<HTMLElement>) => void;
  setSelectedGroup: (group: any) => void;
  onClickOpenModalEditGroup: () => void;
  dir?: string;
  t?: any;
}
