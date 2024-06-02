import { CustomerAuthLayout } from "@/layouts";
import { Permissions } from "../../components/CheckPermission/enum";
import { BoardMissionsListWidget } from "@/pages-components/board-missions/board-missions";

export default function PurchaseJobs() {
  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_BOARD_MISSIONS}>
      <BoardMissionsListWidget isPurchaseJobs={true} />
    </CustomerAuthLayout>
  );
}
