import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import { GomakePrimaryButton } from "@/components";

import { useStyle } from "./style";
import { AddSheetModal } from "./add-sheet-modal";

const HeaderFilter = ({
  openAddSheetModal,
  onCloseModalAdded,
  onOpnModalAdded,
  changeItems,
  setItems,
  items,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <>
      <div style={clasess.addBtnStyle}>
        <GomakePrimaryButton
          style={clasess.btnStyle}
          leftIcon={<AddIcon />}
          onClick={onOpnModalAdded}
        >
          {t("materials.sheetPaper.admin.addNewSheet")}
        </GomakePrimaryButton>
      </div>
      <AddSheetModal
        openModal={openAddSheetModal}
        onCloseModal={onCloseModalAdded}
        changeItems={changeItems}
        items={items}
        setItems={setItems}
      />
    </>
  );
};
export { HeaderFilter };
