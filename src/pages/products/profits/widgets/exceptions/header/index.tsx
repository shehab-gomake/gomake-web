import { useStyle } from "./style";

const Header = ({ key, header, width }: any) => {
  const { clasess } = useStyle({ width, header });
  return (
    <div key={key} style={clasess.headerItem}>
      {header}
    </div>
  );
};
export { Header };
