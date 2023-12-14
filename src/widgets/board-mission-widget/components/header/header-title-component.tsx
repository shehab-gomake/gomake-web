import {useStyle} from "@/widgets/board-mission-widget/components/header/style";

interface IHeaderTitleComponentProps {
    title: string;
}
const HeaderTitleComponent = ({title}: IHeaderTitleComponentProps) => {
  const {classes} = useStyle();
    return  <span style={classes.title}>{title}</span>
}

export {HeaderTitleComponent}