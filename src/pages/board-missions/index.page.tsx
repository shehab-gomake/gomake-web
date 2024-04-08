import { CustomerAuthLayout } from "@/layouts";
import { BoardMissionsListWidget } from "@/pages-components/board-missions/board-missions";
import { Permissions } from "../../components/CheckPermission/enum";

export default function BoardMissions() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_BOARD_MISSIONS}>
      <BoardMissionsListWidget />
    </CustomerAuthLayout>
  );
}
