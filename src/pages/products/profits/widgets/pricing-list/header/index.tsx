import { useStyle } from "./style";

const Header = ({ key, header, width }: any) => {
  const { clasess } = useStyle({ width, header });
  return (
    <div key={key} style={clasess.headerItem}>
      {/* "email":"qass@gomake.net",
      "password":"PassWord@123" */}
      {header}
    </div>
  );
};
export { Header };
