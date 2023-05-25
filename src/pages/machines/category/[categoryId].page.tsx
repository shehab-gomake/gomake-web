import {CustomerAuthLayout} from "@/layouts";
import {CustomerEditMachines} from "@/widgets/machines/customer/edit-machine";

export default function Machine() {

    return (
        <CustomerAuthLayout>
            <div>
                <CustomerEditMachines/>
            </div>
        </CustomerAuthLayout>
    );
};

