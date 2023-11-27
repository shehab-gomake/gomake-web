import {useStyle} from "@/widgets/production-floor-widget/components/style";

interface ITaskCategoryLabelProps {
    label?: string;
}

const TaskCategoryLabel = ({label}: ITaskCategoryLabelProps) => {
    const {classes} = useStyle();
    return (
        <span style={classes.categoryLabel}>
          {label}
      </span>
    )
}

export {TaskCategoryLabel}