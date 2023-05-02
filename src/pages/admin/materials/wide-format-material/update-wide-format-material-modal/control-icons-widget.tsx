import { useRecoilValue } from "recoil";

import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { GoMakeDeleteModal } from "@/components";
import SaveIcon from "@mui/icons-material/Save";
import { materialWideFormatMaterialState } from "../store/wide-format-material";

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
  const materialWideFormatMaterialStateValue = useRecoilValue<any>(
    materialWideFormatMaterialState
  );
  return (
    <>
      <div style={clasess.controlsIconContainer}>
        <Tooltip title={t("materials.sheetPaper.admin.delete")}>
          <IconButton
            onClick={() =>
              materialWideFormatMaterialStateValue.onOpenDeleteModal(item)
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

      {item ===
        materialWideFormatMaterialStateValue.selectedWideFormatMaterialWeight && (
        <GoMakeDeleteModal
          title={title}
          yesBtn={t("materials.sheetPaper.admin.delete")}
          openModal={materialWideFormatMaterialStateValue.openDeleteModal}
          onClose={materialWideFormatMaterialStateValue.onCloseDeleteModal}
          subTitle={subTitle}
          onClickDelete={onClickDelete}
        />
      )}
    </>
  );
};
export { ControlIconsWidget };
