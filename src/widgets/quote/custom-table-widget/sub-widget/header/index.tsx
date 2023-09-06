import { useStyle } from "./style";

const HeaderTable = ({ header, headerWidth, index }: any) => {
  const { clasess } = useStyle({ headerWidth, index });
  return <div style={clasess.headerNameStyle}>{header}</div>;
};
export { HeaderTable };
