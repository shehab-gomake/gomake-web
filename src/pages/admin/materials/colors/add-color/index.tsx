import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakePrimaryButton } from "@/components";

import { ColorMapping } from "./color-mapping";

import { useStyle } from "./style";
import { materialColorState } from "../store/colors";

const AddColor = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialMagnetStateValue = useRecoilValue<any>(materialColorState);

  return (
    <>
      <GoMakeModal
        openModal={materialMagnetStateValue?.openAddMagnetModal}
        modalTitle={t("materials.colors.addNewColor")}
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
                  <ColorMapping key={`magnetMapping${index}`} index={index} />
                );
              }
            )}
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton onClick={materialMagnetStateValue?.addMagnet}>
              {t("materials.colors.addNewColor")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddColor };
