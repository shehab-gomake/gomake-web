import { useMessageTemplate } from "../../useMessageTemplate";
import { useStyle } from "./mail-editor/style";


const PaginationButton = (item) => {
    const { page, type, selected } = item;
    const { classes } = useStyle();
  const { templateVariables } = useMessageTemplate();
    if (type === "page") {
      return (
        < button style={classes.variableStyle}
        onClick={()=>alert()}
            >
                hello
            </button>
      );
    }
}
export { PaginationButton }