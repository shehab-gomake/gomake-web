import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal } from "@/components";
import { DoubleSidedTapeRollMapping } from "./magnet-mapping";
import { materialMagnetState } from "../store/magnets";
import { useStyle } from "./style";

const UpdateMagnetModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialMagnetStateValue = useRecoilValue<any>(materialMagnetState);
  const selectedItem = materialMagnetStateValue?.selectedEditItem;

  return (
    <>
      <GoMakeModal
        openModal={materialMagnetStateValue?.openUpdateMagnetModal}
        modalTitle={`${t("materials.buttons.edit")} ${selectedItem?.name} ${t(
          "materials.doubleSidedTapeRolls.admin.doubleSidedTapeRoll"
        )}`}
        onClose={materialMagnetStateValue?.onCloseUpdateModal}
        insideStyle={clasess.insideStyle}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={clasess.secondSectionContainer}>
            {
              <DoubleSidedTapeRollMapping
                key={`doubleSidedTapeRollMapping_${selectedItem?.code}`}
                index={selectedItem?.code}
                item={selectedItem}
                selectedItem={selectedItem}
              />
            }
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { UpdateMagnetModal };
