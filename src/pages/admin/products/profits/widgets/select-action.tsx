import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeAutoComplate } from "@/components";

import { useStyle } from "../style";
import { Skeleton } from "@mui/material";
import { profitsState } from "../store/profits";

const SelectAction = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const profitsStateValue = useRecoilValue<any>(profitsState);

  return (
    <div style={clasess.filterContainer}>
      {profitsStateValue?.allActions?.length > 0 ? (
        <GoMakeAutoComplate
          options={profitsStateValue?.allActions}
          style={clasess.autoComplateStyle}
          placeholder={
            profitsStateValue?.selectedAction?.name ||
            t("products.profits.admin.chooseAction")
          }
          getOptionLabel={(value: any) => value?.name}
          onChange={profitsStateValue?.onChangeSelectedAction}
          value={profitsStateValue?.selectedAction?.name}
        />
      ) : (
        <Skeleton variant="rectangular" width={200} height={40} />
      )}
    </div>
  );
};
export { SelectAction };
