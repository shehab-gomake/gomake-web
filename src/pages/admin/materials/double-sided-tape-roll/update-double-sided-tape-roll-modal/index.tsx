import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal } from "@/components";
import { DoubleSidedTapeRollMapping } from "./double-sided-tape-roll-mapping";
import { materialDoublesidedTapeRollState } from "../store/double-sided-tape-roll";
import { useStyle } from "./style";

const UpdatalAdditionModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialDoublesidedTapeRollStateValue = useRecoilValue<any>(
    materialDoublesidedTapeRollState
  );
  const selectedItem = materialDoublesidedTapeRollStateValue?.selectedEditItem;

  return (
    <>
      <GoMakeModal
        openModal={
          materialDoublesidedTapeRollStateValue?.openUpdateDoubleSidedTapeRollModal
        }
        modalTitle={`${t("materials.buttons.edit")} ${selectedItem?.name} ${t(
          "materials.doubleSidedTapeRolls.admin.doubleSidedTapeRoll"
        )}`}
        onClose={materialDoublesidedTapeRollStateValue?.onCloseUpdateModal}
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
export { UpdatalAdditionModal };
