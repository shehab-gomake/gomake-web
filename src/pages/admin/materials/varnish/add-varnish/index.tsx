import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakePrimaryButton } from "@/components";

import { VarnishMapping } from "./varnish-mapping";

import { useStyle } from "./style";
import { materialVarnishState } from "../store/varnish";

const AddVarnish = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialVarnishStateValue = useRecoilValue<any>(materialVarnishState);

  return (
    <>
      <GoMakeModal
        openModal={materialVarnishStateValue?.openAddVarnishModal}
        modalTitle={t("materials.varnishs.admin.addNewVarnishs")}
        onClose={materialVarnishStateValue?.onCloseModalAdded}
        insideStyle={clasess.insideStyle}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={clasess.secondSectionContainer}>
            {materialVarnishStateValue?.items?.map(
              (item: any, index: number) => {
                return (
                  <VarnishMapping key={`magnetMapping${index}`} index={index} />
                );
              }
            )}
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={materialVarnishStateValue?.addVarnish}
            >
              {t("materials.varnishs.admin.addNewVarnishs")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddVarnish };
