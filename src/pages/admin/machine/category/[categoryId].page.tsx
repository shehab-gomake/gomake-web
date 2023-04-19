import {AdminAuthLayout} from "@/layouts";
import {AddMachine} from "@/widgets/admin-machines/add-machine";
import {AdminMachines} from "@/widgets/admin-machines/machines";
import {useRouter} from "next/router";
import {useRecoilValue} from "recoil";
import {machineCategoriesState} from "@/store/machine-categories";

export default function Machine() {
    const router = useRouter();
    const categories = useRecoilValue(machineCategoriesState);
    const {categoryId} = router.query;
    const categoryName = !!categoryId ? categories.find((category) => category.id === categoryId)?.name : null;
    return (
        <AdminAuthLayout>
            <div>
                <h1 style={{padding: '10px 0'}}>{categoryName}</h1>
                <AdminMachines/>
            </div>
        </AdminAuthLayout>
    );
};

