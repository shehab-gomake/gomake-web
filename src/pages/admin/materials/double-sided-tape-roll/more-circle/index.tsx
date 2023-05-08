import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";
import { IconWidget } from "./icon-widget";
import { useApplicationModal } from "./use-double-sided-tape-roll-modal";

import { materialDoublesidedTapeRollState } from "../store/double-sided-tape-roll";
import { UpdatalAdditionModal } from "../update-double-sided-tape-roll-modal";

const DoubleSidedTapeRollSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteDoubleSidedTapeRoll,
    t,
  } = useApplicationModal({
    item,
  });
  const materialDoublesidedTapeRollStateValue = useRecoilValue<any>(
    materialDoublesidedTapeRollState
  );

  return (
    <>
      <IconWidget
        t={t}
        onOpnUpdateModal={() => {
          materialDoublesidedTapeRollStateValue?.onOpnUpdateModal(item);
        }}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      <GoMakeDeleteModal
        hideIcon={true}
        title={t(
          "materials.doubleSidedTapeRolls.admin.deleteDoubleSidedTapeRoll"
        )}
        yesBtn={t("materials.buttons.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t(
          "materials.doubleSidedTapeRolls.admin.subTitleDeleteModal",
          {
            name: `${item?.name}`,
          }
        )}?`}
        onClickDelete={deleteDoubleSidedTapeRoll}
      />
      {item === materialDoublesidedTapeRollStateValue.selectedEditItem && (
        <UpdatalAdditionModal />
      )}
    </>
  );
};
export { DoubleSidedTapeRollSettingsWidget };
