import Button from "@mui/material/Button";
import {useRouter} from "next/router";
import Link from "next/link";
import {GomakePrimaryButton} from "@/components";
import {useRecoilValue} from "recoil";
import {machineCategoriesState} from "@/store/machine-categories";

const MachineCategories = () => {
    const router = useRouter();
    const {categoryId} = router.query
    const categories = useRecoilValue(machineCategoriesState);
    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '40px'}}>
            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
                {
                    categories.map((category) => <Button component={Link} href={category.id.toString()}
                                                         variant={"contained"}> {category.name}</Button>)
                }
            </div>
            <div style={{width: 'fit-content'}}>
                <GomakePrimaryButton  href={`/admin/machine/add-machine/category/${categoryId}`}>Add machine</GomakePrimaryButton>
            </div>
        </div>
    );
}

export {MachineCategories};