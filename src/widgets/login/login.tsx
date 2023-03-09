import { useStyle } from "./style";

const LoginWidget = () => {
  const { clasess } = useStyle();

  return <div style={clasess.container}>Hey</div>;
};
export { LoginWidget };
