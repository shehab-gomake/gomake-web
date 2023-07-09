import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { materialLaminationState } from "../store/lamination";
import { useStyle } from "./style";
import { useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const DuplicateModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { setSnackbarStateValue } = useSnackBar();
  const materialStore = useRecoilValue<any>(materialLaminationState);
  const selectedItem = materialStore?.selectedEditItem;
  const [newName, setNewName] = useState("");
  const { callApi } = useGomakeAxios();
  const duplicateCategory = async () => {
    const res = await callApi(
      "POST",
      `/v1/administrator/lamination/duplicate-lamination`,
      {
        categoryName: selectedItem?.categoryName,
        newName,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      await materialStore?.getCategory();
      materialStore?.onCloseDuplicateModal();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  };
  return (
    <>
      <GoMakeModal
        openModal={materialStore?.openDuplicateSheetModal}
        modalTitle={`Duplicate ${selectedItem?.categoryName} Lamination`}
        onClose={materialStore?.onCloseDuplicateModal}
        insideStyle={clasess.insideStyle}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={clasess.firstSectionContainer}>
            <div>
              <div style={clasess.lableTextStyle}>
                {t("materials.inputs.categoryName")}
              </div>
              <GomakeTextInput
                placeholder={t("materials.inputs.categoryName")}
                style={clasess.textInputStyle}
                onChange={(e: any) => setNewName(e.target.value)}
                value={newName}
              />
            </div>
            <div
              style={{
                marginTop: 20,
              }}
            >
              <GomakePrimaryButton onClick={duplicateCategory}>
                Duplicate
              </GomakePrimaryButton>
            </div>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { DuplicateModal };
