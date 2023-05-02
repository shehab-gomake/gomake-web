import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal } from "@/components";
import { AdditionMapping } from "./addition-mapping";
import { materialAdditionsState } from "../store/additions";
import { useStyle } from "./style";

const UpdatalAdditionModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialAdditionsStateValue = useRecoilValue<any>(
    materialAdditionsState
  );
  const selectedItem = materialAdditionsStateValue?.selectedEditItem;

  return (
    <>
      <GoMakeModal
        openModal={materialAdditionsStateValue?.openUpdatalApplicationModal}
        modalTitle={`${t("materials.additions.admin.edit")} ${
          selectedItem?.name
        } ${t("materials.additions.admin.addition")}`}
        onClose={materialAdditionsStateValue?.onCloseUpdateModal}
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
              <AdditionMapping
                key={`AdditionMapping_${selectedItem?.code}`}
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
