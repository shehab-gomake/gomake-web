import { GoMakeAutoComplate} from "@/components";
import { Skeleton } from "@mui/material";
import { useStyle } from "./style";
import { Placeholder } from "react-bootstrap";

const HeaderFilter = ({
    setAllOptions,
    setPlaceholder,
  }: any) => {
    const { clasess } = useStyle();

    return (
        <div >
            {setAllOptions?.length > 0 ? (
                <GoMakeAutoComplate
                    options={setAllOptions}
                    style={clasess.autoComplateStyle}
                    placeholder={setPlaceholder}
                />
            ) : (
                <Skeleton variant="rectangular" width={180} height={40} />
                )}
        </div>
    );
};
export { HeaderFilter };
