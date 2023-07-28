import { useRecoilValue } from "recoil";

import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { GoMakeDeleteModal } from "@/components";
import SaveIcon from "@mui/icons-material/Save";
import { materialLaminationState } from "../store/lamination";

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
  const materialLaminationStateValue = useRecoilValue<any>(
    materialLaminationState
  );
  return (
    <>
      <div style={clasess.controlsIconContainer}>
        <Tooltip title={t("materials.buttons.delete")}>
          <IconButton
            onClick={() => materialLaminationStateValue.onOpenDeleteModal(item)}
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

      {item === materialLaminationStateValue.selectedLaminationWeight && (
        <GoMakeDeleteModal
          title={title}
          yesBtn={t("materials.buttons.delete")}
          openModal={materialLaminationStateValue.openDeleteModal}
          onClose={materialLaminationStateValue.onCloseDeleteModal}
          subTitle={subTitle}
          onClickDelete={onClickDelete}
        />
      )}
    </>
  );
};
export { ControlIconsWidget };
