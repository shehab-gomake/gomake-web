import { GoMakeAutoComplate} from "@/components";
import { Skeleton } from "@mui/material";
import { useStyle } from "./style";

interface IProps {
    setAllOptions?: any;
    setPlaceholder?: any;
    onchange?: () => void;
    val?: string;
  }

const HeaderFilter = ({setAllOptions , setPlaceholder , onchange , val }: IProps) => {
    const { classes } = useStyle();

    return (
        <div >
            {setAllOptions?.length > 0 || val!=null ? (
                <GoMakeAutoComplate
                    options={setAllOptions}
                    style={classes.autoComplateStyle}
                    placeholder={setPlaceholder}
                    onChange={onchange}
                    value={val}
                />
            ) : (
                <Skeleton variant="rectangular" width={180} height={40} />
                )}
        </div>
    );
};
export { HeaderFilter };
