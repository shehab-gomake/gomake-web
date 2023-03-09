import { LoginLeftSide } from "./left-side/left-side";
import { LoginRightSide } from "./right-side/right-side";
import { useStyle } from "./style";

const LoginWidget = () => {
  const { clasess } = useStyle();

  return (
    <div style={clasess.container}>
      <LoginLeftSide />
      <LoginRightSide />
    </div>
  );
};
export { LoginWidget };
