import { useTranslation } from "react-i18next";
import { useStyle } from "./style";

const Edit = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <div style={clasess.mainCointaner}>
      <div style={clasess.editCointaner}>Edit</div>
    </div>
  );
};
export default Edit;
