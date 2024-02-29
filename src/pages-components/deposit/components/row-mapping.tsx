import { PrimaryTableCell } from "@/components/tables/primary-table";
import { TableRow } from "@mui/material";
import { useStyle } from "../style";
import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";

const RowMappingWidget = ({
    item,
    index,
}) => {
    const { classes } = useStyle();
    const { t } = useTranslation();

    return (
        <TableRow
            key={item.id}
            style={{ background: index % 2 === 0 ? "#FFFFFF" : "#F8FAFB" }}>
            <PrimaryTableCell
                style={{
                    width:"20%",
                    ...classes.cellContainerStyle,
                    color: "#000000",
                }}
            >
                {item?.docDate}
            </PrimaryTableCell>
            <PrimaryTableCell
                style={{
                    width:"20%",
                    ...FONT_FAMILY.Inter(600, 14),
                    color: "#5859A8",
                    ...classes.cellContainerStyle,
                }}
            >
                {item.docNum}
            </PrimaryTableCell>

            <PrimaryTableCell
                style={{
                    width:"20%",
                    ...classes.cellContainerStyle
                }}
            >{item?.documentType}
            </PrimaryTableCell>
            <PrimaryTableCell
                style={{
                    width:"20%",
                    ...classes.cellContainerStyle,
                }}
            >{t(item?.documentTypeText)}
            </PrimaryTableCell>
            <PrimaryTableCell
                style={{
                    width:"20%",
                    ...classes.cellContainerStyle,
                }}
            >{item?.sumApplied}
            </PrimaryTableCell>
        </TableRow>
    );
};
export { RowMappingWidget };