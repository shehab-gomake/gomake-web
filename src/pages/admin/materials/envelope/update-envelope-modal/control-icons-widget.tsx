import { useRecoilValue } from "recoil";

import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { GoMakeDeleteModal } from "@/components";
import SaveIcon from "@mui/icons-material/Save";
import { materialEnvelopeState } from "../store/envelope";

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
  const materialEnvelopesStateValue = useRecoilValue<any>(
    materialEnvelopeState
  );
  return (
    <>
      <div style={clasess.controlsIconContainer}>
        <Tooltip title={t("materials.sheetPaper.admin.delete")}>
          <IconButton
            onClick={() => materialEnvelopesStateValue.onOpenDeleteModal(item)}
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

      {item === materialEnvelopesStateValue.selectedEnvelopeWeight && (
        <GoMakeDeleteModal
          title={title}
          yesBtn={t("materials.sheetPaper.admin.delete")}
          openModal={materialEnvelopesStateValue.openDeleteModal}
          onClose={materialEnvelopesStateValue.onCloseDeleteModal}
          subTitle={subTitle}
          onClickDelete={onClickDelete}
        />
      )}
    </>
  );
};
export { ControlIconsWidget };
