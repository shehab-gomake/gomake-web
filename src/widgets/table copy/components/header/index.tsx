import { useStyle } from "./style";

const Header = ({ header, width }: any) => {
  const { clasess } = useStyle({ width, header });
  return <div style={clasess.headerItem}>{header}</div>;
};
export { Header };
