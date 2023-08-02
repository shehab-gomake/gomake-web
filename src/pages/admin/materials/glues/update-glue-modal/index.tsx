import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal } from "@/components";
import { GluesMapping } from "./glue-mapping";
import { materialGluesState } from "../store/glues";
import { useStyle } from "./style";

const UpdateGluesModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialMagnetStateValue = useRecoilValue<any>(materialGluesState);
  const selectedItem = materialMagnetStateValue?.selectedEditItem;

  return (
    <>
      <GoMakeModal
        openModal={materialMagnetStateValue?.openUpdateMagnetModal}
        modalTitle={`${t("materials.buttons.edit")} ${selectedItem?.name}`}
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
              <GluesMapping
                key={`doubleSidedTapeRollMapping_${selectedItem?.code}`}
                index={selectedItem?.code}
                item={selectedItem}
                // selectedItem={selectedItem}
              />
            }
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { UpdateGluesModal };
