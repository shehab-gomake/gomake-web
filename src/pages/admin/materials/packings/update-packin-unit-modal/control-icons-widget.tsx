import { useRecoilValue } from "recoil";

import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { GoMakeDeleteModal } from "@/components";
import SaveIcon from "@mui/icons-material/Save";

import { useStyle } from "./style";
import { materialPackingsState } from "../store/packings";

const ControlIconsWidget = ({
  t,
  onClickUpdate,
  onClickDelete,
  title,
  subTitle,
  item,
}) => {
  const { clasess } = useStyle();
  const materialPackingsStateValue = useRecoilValue<any>(materialPackingsState);
  return (
    <>
      <div style={clasess.controlsIconContainer}>
        <Tooltip title={t("materials.buttons.delete")}>
          <IconButton
            onClick={() => materialPackingsStateValue.onOpenDeleteModal(item)}
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

      {item === materialPackingsStateValue.selectedPlatWeight && (
        <GoMakeDeleteModal
          title={title}
          yesBtn={t("materials.buttons.delete")}
          openModal={materialPackingsStateValue.openDeleteModal}
          onClose={materialPackingsStateValue.onCloseDeleteModal}
          subTitle={subTitle}
          onClickDelete={onClickDelete}
        />
      )}
    </>
  );
};
export { ControlIconsWidget };
