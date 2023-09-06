import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate, GomakePrimaryButton, GomakeTextInput } from "@/components";
import { Skeleton } from "@mui/material";
import { useStyle } from "./style";
import { useEffect } from "react";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import * as React from 'react';

const HeaderFilter = ({ status, onChangeStatus , valStatus , handleClean
}: any) => {
    const { t } = useTranslation();
    const { clasess } = useStyle();

    return (
        <div>
            <div style={clasess.filterContainer}>
                {status?.length > 0 ? (
                    <GoMakeAutoComplate
                        options={status}
                        style={clasess.autoComplateStyle}
                        placeholder={t("suppliers.selectStatus")}
                        onChange={onChangeStatus}
                        value={valStatus}
                    />
                ) : (
                    <Skeleton variant="rectangular" width={200} height={40} />
                )}
                <GomakePrimaryButton style={clasess.autoButtonStyle} onClick={handleClean} >{t("suppliers.buttons.clean")}</GomakePrimaryButton>
            </div>
        </div>
    );
};
export { HeaderFilter };
