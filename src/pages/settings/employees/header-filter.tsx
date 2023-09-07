import { GomakePrimaryButton, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useEffect } from "react";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import * as React from 'react';

const HeaderFilter = ({ onChangeName }: any) => {
    const { clasess } = useStyle();

    return (
            <GomakeTextInput
                type={"text"}
                onChange={onChangeName}
                style={{
                    height: convertHeightToVH(42),
                    width: convertWidthToVW(200),
                }}
                 />
    );
};
export { HeaderFilter };
