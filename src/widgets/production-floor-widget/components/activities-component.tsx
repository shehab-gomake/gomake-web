import {EActivityType} from "@/widgets/production-floor-widget/enums";
import Stack from "@mui/material/Stack";
import {DateFormatterDDMMYYYY} from "@/utils/adapter";

export interface IActivity {
  id: string;
  type: EActivityType;
  description: string;
  date: Date;
}
interface IActivitiesProps {
  activities: IActivity[]
}

const ActivityComponent = ({activity}: {activity: IActivity}) => {
  return <Stack padding={2} direction={'row'} gap={'20px'} boxShadow={'0px 4px 40px 0px rgba(0, 0, 0, 0.08)'}>
    <span>{activity.description}</span>
    <Stack alignSelf={'flex-end'}>5/10/23</Stack>
  </Stack>
}
const ActivitiesComponent = ({activities}: IActivitiesProps) => {
  return (
      <Stack gap={'16px'}>
        {
          activities.map((activity) => <ActivityComponent activity={activity}/>)
        }
      </Stack>
  )
}

export {ActivitiesComponent}