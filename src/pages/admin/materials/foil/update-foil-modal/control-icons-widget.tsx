import { useRecoilValue } from "recoil";

import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { GoMakeDeleteModal } from "@/components";
import SaveIcon from "@mui/icons-material/Save";
import { materialFoilState } from "../store/foil";

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
  const materialFoilStateValue = useRecoilValue<any>(materialFoilState);
  return (
    <>
      <div style={clasess.controlsIconContainer}>
        <Tooltip title={t("materials.buttons.delete")}>
          <IconButton
            onClick={() => materialFoilStateValue.onOpenDeleteModal(item)}
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

      {item === materialFoilStateValue.selectedFoilWeight && (
        <GoMakeDeleteModal
          title={title}
          yesBtn={t("materials.buttons.delete")}
          openModal={materialFoilStateValue.openDeleteModal}
          onClose={materialFoilStateValue.onCloseDeleteModal}
          subTitle={subTitle}
          onClickDelete={onClickDelete}
        />
      )}
    </>
  );
};
export { ControlIconsWidget };
