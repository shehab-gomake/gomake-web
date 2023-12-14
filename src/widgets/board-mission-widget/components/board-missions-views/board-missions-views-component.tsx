import Stack from "@mui/material/Stack";
import {useBoardMissionsViews} from "@/widgets/board-mission-widget/hooks/use-board-missions-views";

const BoardMissionsViewsComponent = () => {
    const {curViewComponent} = useBoardMissionsViews();
    return (
      <Stack>
          {curViewComponent()}
      </Stack>
  );
}

export {BoardMissionsViewsComponent}