import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate} from "@/components";
import { Skeleton } from "@mui/material";
import { useStyle } from "./style";

const HeaderFilter = ({
    setAllOptions,
    setPlaceholder,
    val

  }: any) => {
    const { t } = useTranslation();
    const { clasess } = useStyle();

    return (
        <div >
            {setAllOptions?.length > 0 ? (
                <GoMakeAutoComplate
                    options={setAllOptions}
                    style={clasess.autoComplateStyle}
                    placeholder={setPlaceholder}
                    value={val}
                />
            ) : (
                <Skeleton variant="rectangular" width={180} height={40} />
            )}
        </div>
    );
};
export { HeaderFilter };
