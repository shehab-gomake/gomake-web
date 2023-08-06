import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakePrimaryButton } from "@/components";

import { GluesMapping } from "./glue-mapping";

import { useStyle } from "./style";
import { materialGluesState } from "../store/glues";

const AddColor = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialMagnetStateValue = useRecoilValue<any>(materialGluesState);

  return (
    <>
      <GoMakeModal
        openModal={materialMagnetStateValue?.openAddMagnetModal}
        modalTitle={t("materials.glues.addNewGlue")}
        onClose={materialMagnetStateValue?.onCloseModalAdded}
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
            {materialMagnetStateValue?.items?.map(
              (item: any, index: number) => {
                return (
                  <GluesMapping key={`magnetMapping${index}`} index={index} />
                );
              }
            )}
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton onClick={materialMagnetStateValue?.addMagnet}>
              {t("materials.glues.addNewGlue")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddColor };
