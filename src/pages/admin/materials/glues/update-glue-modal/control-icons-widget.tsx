import { useRecoilValue } from "recoil";

import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { GoMakeDeleteModal } from "@/components";
import SaveIcon from "@mui/icons-material/Save";
import { materialGluesState } from "../store/glues";

import { useStyle } from "./style";

const ControlIconsWidget = ({
  t,
  onClickUpdate,
  onClickDelete,
  title,
  subTitle,
  item,
}) => {
  const { clasess } = useStyle();
  const materialSheetsStateValue = useRecoilValue<any>(materialGluesState);
  return (
    <>
      <div style={clasess.controlsIconContainer}>
        <Tooltip title={t("materials.buttons.delete")}>
          <IconButton
            onClick={() => materialSheetsStateValue.onOpenDeleteModal(item)}
          >
            <DeleteIcon style={{ color: "#a1a2cd" }} />
          </IconButton>
        </Tooltip>
        <Tooltip title={t("materials.buttons.saveModifications")}>
          <IconButton onClick={onClickUpdate}>
            <SaveIcon style={{ color: "#a1a2cd" }} />
          </IconButton>
        </Tooltip>
      </div>

      {item === materialSheetsStateValue.selectedMagnet && (
        <GoMakeDeleteModal
          title={title}
          yesBtn={t("materials.buttons.delete")}
          openModal={materialSheetsStateValue.openDeleteModal}
          onClose={materialSheetsStateValue.onCloseDeleteModal}
          subTitle={subTitle}
          onClickDelete={onClickDelete}
        />
      )}
    </>
  );
};
export { ControlIconsWidget };
