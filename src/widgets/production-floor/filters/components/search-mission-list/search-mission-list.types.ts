export interface SearchMissionListProps {
  missionsList: any[];
  handleMissionClick: (id: string, productType: string) => void;
}

export interface MissionOption {
  id: string;
  boardMissionNumber: string;
  orderNumber: string;
  clientName: string;
  productType?: string;
}
