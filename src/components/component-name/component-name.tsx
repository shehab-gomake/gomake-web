import { IComponentName } from "./interfaces";
import { useStyle } from "./style";

const ComponentName = ({ text }: IComponentName) => {
  const { clasess } = useStyle();

  return <div style={clasess.container}>{text}</div>;
};
export { ComponentName };
