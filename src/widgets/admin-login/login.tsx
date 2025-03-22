import { LoginLeftSide } from "./left-side/left-side";
import { useStyle } from "./style";

const AdminLoginWidget = () => {
  const { classes } = useStyle();

  return (
    <div style={classes.container}>
      <LoginLeftSide />
    </div>
  );
};
export { AdminLoginWidget };
