import {IBoardMissionsActivity} from "@/widgets/production-floor/interfaces/board-missions-activity";
import {EActivityType} from "@/widgets/production-floor/enums/activity-type";
import {CommentComponent} from "@/widgets/production-floor/views/board-missions-view/activity/comment-component";
import {LogComponent} from "@/widgets/production-floor/views/board-missions-view/activity/log-component";

const ActivityComponent = (activity: IBoardMissionsActivity) => {
    return activity.activityType === EActivityType.COMMENT ? <CommentComponent {...activity}/> :
        <LogComponent {...activity}/>;
}

export {ActivityComponent}