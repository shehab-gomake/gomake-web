import { useRecoilValue } from "recoil";

import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { GoMakeDeleteModal } from "@/components";
import SaveIcon from "@mui/icons-material/Save";
import { materialTubeState } from "../store/tube";

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
  const materialTubeStateValue = useRecoilValue<any>(materialTubeState);
  return (
    <>
      <div style={clasess.controlsIconContainer}>
        <Tooltip title={t("materials.sheetPaper.admin.delete")}>
          <IconButton
            onClick={() => materialTubeStateValue.onOpenDeleteModal(item)}
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

      {item === materialTubeStateValue.selectedTubeWeight && (
        <GoMakeDeleteModal
          title={title}
          yesBtn={t("materials.sheetPaper.admin.delete")}
          openModal={materialTubeStateValue.openDeleteModal}
          onClose={materialTubeStateValue.onCloseDeleteModal}
          subTitle={subTitle}
          onClickDelete={onClickDelete}
        />
      )}
    </>
  );
};
export { ControlIconsWidget };
