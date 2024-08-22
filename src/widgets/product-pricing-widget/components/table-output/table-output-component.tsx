import { RollingDeployment } from "@/widgets/product-pricing-widget/interface";
import { useState } from "react";
import { GoMakeModal } from "@/components";
import { PrimaryButton } from "@/components/button/primary-button";
import { PrimaryTableForOutputs } from "@/components/tables/primary-table-output";

const TableOutPutComponent = ({ name, tableHeaders, tableRows }: RollingDeployment) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div>
            <PrimaryButton variant={'contained'} style={{ fontSize: '15px' }} onClick={() => setOpen(true)}>{name}</PrimaryButton>
            <GoMakeModal openModal={open} onClose={() => setOpen(false)}
                modalTitle={name}
                insideStyle={{ width: "fit-content", height: 'fit-content', maxHeight: '80%', minWidth: '40%' }}>
                <div style={{ margin: 10 }}>
                    <PrimaryTableForOutputs
                        headers={tableHeaders}
                        rows={tableRows}
                        stickyHeader={true}
                        stickyFirstCol={true}
                        maxHeight={450}
                    />

                </div>
            </GoMakeModal>
        </div>
    );
}
export { TableOutPutComponent }