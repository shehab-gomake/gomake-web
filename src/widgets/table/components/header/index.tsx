import { useStyle } from "./style";

const Header = ({ header, index }: any) => {
  const { clasess } = useStyle();
  return <div style={clasess.headerItem}>{header}</div>;
};

export { Header };
