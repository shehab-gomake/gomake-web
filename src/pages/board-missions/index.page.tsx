import { CustomerAuthLayout } from "@/layouts";
import { BoardMissionsListWidget } from "@/pages-components/board-missions/board-missions";

export default function BoardMissions() {
  return (
    <CustomerAuthLayout>
      <BoardMissionsListWidget />
    </CustomerAuthLayout>
  );
}
