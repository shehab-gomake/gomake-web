import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeAutoComplate } from "@/components";

import { useStyle } from "../style";
import { Skeleton } from "@mui/material";
import { profitsState } from "../store/profits";
import { useEffect, useState } from "react";

const SelectAction = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const profitsStateValue = useRecoilValue<any>(profitsState);

  const [actionDefault, setActionDefault] = useState({});
  useEffect(() => {
    if (profitsStateValue?.selectedAction) {
      setActionDefault(profitsStateValue?.selectedAction);
    }
  }, [profitsStateValue]);
  return (
    <div style={clasess.filterContainer}>
      {profitsStateValue?.allActions?.length > 0 ? (
        <GoMakeAutoComplate
          options={profitsStateValue?.allActions}
          style={clasess.autoComplateStyle}
          placeholder={t("products.profits.admin.chooseAction")}
          getOptionLabel={(value: any) => value?.name}
          onChange={profitsStateValue?.onChangeSelectedAction}
          //@ts-ignore
          value={actionDefault}
        />
      ) : (
        <Skeleton variant="rectangular" width={200} height={40} />
      )}
    </div>
  );
};
export { SelectAction };
