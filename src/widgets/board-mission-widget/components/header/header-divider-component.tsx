import {Divider} from "@mui/material";
import {useStyle} from "@/widgets/board-mission-widget/components/header/style";

const HeaderDividerComponent = () => {
    const {classes} = useStyle()
  return <Divider orientation={'vertical'} style={classes.divider} flexItem/>
}

export {HeaderDividerComponent}