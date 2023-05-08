import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal } from "@/components";
import { DoubleSidedTapeRollMapping } from "./varnish-mapping";
import { materialVarnishState } from "../store/varnish";
import { useStyle } from "./style";

const UpdateVarnishModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialVarnishStateValue = useRecoilValue<any>(materialVarnishState);
  const selectedItem = materialVarnishStateValue?.selectedEditItem;

  return (
    <>
      <GoMakeModal
        openModal={materialVarnishStateValue?.openUpdateVarnishModal}
        modalTitle={`${t("materials.buttons.edit")} ${
          selectedItem?.typeName
        } ${t("materials.varnishs.admin.varnishs")}`}
        onClose={materialVarnishStateValue?.onCloseUpdateModal}
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
export { UpdateVarnishModal };
