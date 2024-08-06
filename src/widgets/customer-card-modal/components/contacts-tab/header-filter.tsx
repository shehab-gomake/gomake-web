import { GoMakeAutoComplate} from "@/components";
import { Skeleton } from "@mui/material";
import { useStyle } from "./style";

const HeaderFilter = ({
    setAllOptions,
    setPlaceholder,
    onchange,
    val
  }: any) => {
    const { classes } = useStyle();
    return (
        <div >
            {setAllOptions?.length > 0 ? (
                <GoMakeAutoComplate
                    options={setAllOptions}
                    style={classes.autoComplateStyle}
                    placeholder={setPlaceholder}
                    onChange={onchange}
                    value={val}
                />
            ) : (
                <Skeleton variant="rectangular" width={200} height={40} />
            )}
        </div>
    );
};
export { HeaderFilter };
