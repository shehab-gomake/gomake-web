
import { TableDeliveryTimeFilter } from "./components/table-filter/table-filter";
import { NumberingTable } from "./components/numbering-table/numbering-table";
import { useStyle } from "./style";

const DocumentNumbering = () => {
    const {classes} = useStyle();
    return (
        <div style={classes.container}>
            <div style={classes.header}>
                <TableDeliveryTimeFilter
                ></TableDeliveryTimeFilter>
            </div>
            <NumberingTable/>
        </div>
    );
};

export {DocumentNumbering};
