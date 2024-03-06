import { PrimaryTableCell } from "@/components/tables/primary-table";
import { Checkbox, TableRow } from "@mui/material";
import { useStyle } from "./style";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

const RowMappingWidget = ({
    item,
    index,
    columnWidths,
    headerHeight,
    onCheckboxChange,
    isChecked
}) => {
    const { classes } = useStyle({ headerHeight });
    const { t } = useTranslation();
    const router = useRouter();

    return (

        <TableRow
            key={item.id}
            style={{ background: index % 2 === 0 ? "#FFFFFF" : "#F8FAFB" }}>
            {router?.query?.isNewCreation && <PrimaryTableCell
                style={{ width: columnWidths[0], ...classes.cellContainerStyle }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                    }}
                >
                    <Checkbox
                        icon={<CheckboxIcon />}
                        checkedIcon={<CheckboxCheckedIcon />}
                        checked={isChecked}
                        onChange={onCheckboxChange}
                    />
                </div>
            </PrimaryTableCell>
            }
            <PrimaryTableCell
                style={{
                    width: columnWidths[1],
                    ...classes.cellContainerStyle,
                    color: "#000000",
                }}
            >
                {item?.docDate}
            </PrimaryTableCell>
            <PrimaryTableCell
                style={{
                    width: columnWidths[2],
                    ...FONT_FAMILY.Inter(600, 14),
                    color: "#5859A8",
                    ...classes.cellContainerStyle,
                }}
            >
                {item.docNum}
            </PrimaryTableCell>

            <PrimaryTableCell
                style={{
                    width: columnWidths[3],
                    ...classes.cellContainerStyle
                }}
            >{item?.documentType}
            </PrimaryTableCell>
            <PrimaryTableCell
                style={{
                    width: columnWidths[4],
                    ...classes.cellContainerStyle,
                }}
            >{t(item?.documentTypeText)}
            </PrimaryTableCell>
            <PrimaryTableCell
                style={{
                    width: columnWidths[5],
                    ...classes.cellContainerStyle,
                }}
            >{item?.sumApplied}
            </PrimaryTableCell>
        </TableRow>
    );
};
export { RowMappingWidget };