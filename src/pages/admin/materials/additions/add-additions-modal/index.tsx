import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakePrimaryButton } from "@/components";

import { AdditionMapping } from "./additions-mapping";

import { useStyle } from "./style";
import { materialAdditionsState } from "../store/additions";

const AddAdditionModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialAdditionsStateValue = useRecoilValue<any>(
    materialAdditionsState
  );

  return (
    <>
      <GoMakeModal
        openModal={materialAdditionsStateValue?.openAddApplicationsModal}
        modalTitle={t("materials.additions.admin.addNewAddition")}
        onClose={materialAdditionsStateValue?.onCloseModalAdded}
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
            {materialAdditionsStateValue?.items?.map(
              (item: any, index: number) => {
                return (
                  <AdditionMapping
                    key={`AdditionMapping_${index}`}
                    index={index}
                  />
                );
              }
            )}
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={materialAdditionsStateValue?.addNewAddition}
            >
              {t("materials.additions.admin.addNewAddition")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddAdditionModal };
