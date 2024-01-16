import {AdminAuthLayout, CustomerAuthLayout} from "@/layouts";
import {AdminUpdateMachine} from "@/widgets/machines/admin/admin-update-machine";
import React from "react";

export default function Machine() {

    return (
        <CustomerAuthLayout>
            <div>
                <AdminUpdateMachine/>
            </div>
        </CustomerAuthLayout>
    );
};

