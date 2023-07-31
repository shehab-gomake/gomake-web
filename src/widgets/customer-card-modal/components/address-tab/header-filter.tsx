import { GoMakeAutoComplate} from "@/components";
import { Skeleton } from "@mui/material";
import { useStyle } from "./style";

const HeaderFilter = ({
    setAllOptions,
    setPlaceholder,
    val,
    onchange
  }: any) => {
    const { clasess } = useStyle();
    return (
        <div >
            {setAllOptions?.length > 0 || val!=null ? (
                <GoMakeAutoComplate
                    options={setAllOptions}
                    style={clasess.autoComplateStyle}
                    placeholder={setPlaceholder}
                    value={val}
                    onChange={onchange}
                />
            ) : (
                <Skeleton variant="rectangular" width={180} height={40} />
            )}
        </div>
    );
};
export { HeaderFilter };
