import { useStyle } from "./style";

const HeaderTitle = ({...props}) => {
  const { clasess } = useStyle();

  return (
    <div style={clasess.container}>
      <div style={clasess.titleStyle}>{props.title}</div>
    </div>
  );
};
export { HeaderTitle };
