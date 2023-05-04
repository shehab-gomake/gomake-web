import { useRecoilValue } from "recoil";

import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { GoMakeDeleteModal } from "@/components";
import SaveIcon from "@mui/icons-material/Save";
import { materialPackinUnitsState } from "../store/packin-units";

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
  const materialPackinUnitsStateValue = useRecoilValue<any>(
    materialPackinUnitsState
  );
  return (
    <>
      <div style={clasess.controlsIconContainer}>
        <Tooltip title={t("materials.canvasFrames.admin.delete")}>
          <IconButton
            onClick={() =>
              materialPackinUnitsStateValue.onOpenDeleteModal(item)
            }
          >
            <DeleteIcon style={{ color: "#a1a2cd" }} />
          </IconButton>
        </Tooltip>
        <Tooltip title={t("materials.sheetPaper.admin.saveModifications")}>
          <IconButton onClick={onClickUpdate}>
            <SaveIcon style={{ color: "#a1a2cd" }} />
          </IconButton>
        </Tooltip>
      </div>

      {item === materialPackinUnitsStateValue.selectedPlatWeight && (
        <GoMakeDeleteModal
          title={title}
          yesBtn={t("materials.canvasFrames.admin.delete")}
          openModal={materialPackinUnitsStateValue.openDeleteModal}
          onClose={materialPackinUnitsStateValue.onCloseDeleteModal}
          subTitle={subTitle}
          onClickDelete={onClickDelete}
        />
      )}
    </>
  );
};
export { ControlIconsWidget };
