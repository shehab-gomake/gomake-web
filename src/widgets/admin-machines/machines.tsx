import {MachinesTable} from "@/widgets/admin-machines/machines-table/machines-table";
import {MachineCategories} from "@/widgets/admin-machines/categories/machine-categories";

const AdminMachines = () => {
    return (
        <>
            <MachineCategories/>
            <MachinesTable/>
        </>
    );
}
export {AdminMachines};