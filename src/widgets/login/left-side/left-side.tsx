import { useStyle } from "./style";

const LoginLeftSide = () => {
  const { clasess } = useStyle();

  return <div style={clasess.leftContainer}>Left</div>;
};
export { LoginLeftSide };
