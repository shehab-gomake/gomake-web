import {QuickSetupLayout} from "@/layouts/quick-setup-layout/quick-setup-layout";
import {MachinesSetupWidget} from "@/widgets/quick-setup-widgets/machines/machines-setup-widget";
import {CustomerAuthLayout} from "@/layouts";
import {useRecoilValue} from "recoil";
import {machineCategoriesState} from "@/store/machine-categories";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

export default function QuickSetupMachinesPage() {
    const machinesCategories = useRecoilValue(machineCategoriesState);
    const notIncludedCategories: ECategoryId[] = [
        ECategoryId.GLUING_MACHINE,
        ECategoryId.FLATBED_CUTTING_MACHINE,
        ECategoryId.ANALOG_ENHANCEMENT_MACHINE,
        ECategoryId.AUTO_BOOK_CUTTING_MACHINE,
        ECategoryId.GUILLOTINE,
        ECategoryId.SHRINK_PACKING_MACHINE,
        ECategoryId.PACKAGE_TYING_MACHINE,
        ECategoryId.CARTOON_PACKAGING_MACHINE,
        ECategoryId.DIGITAL_PRINTING,
        ECategoryId.OFSSET_PRINTING,
        ECategoryId.ROLL_DIGITAL_PRINTING,
        ECategoryId.FLEXO_PRINTING,
        ECategoryId.ROLL_WIDE_PRINTING,
        ECategoryId.SILK_PRINTER
    ];
    return (
        <CustomerAuthLayout disableHeaderSideMenu={true}>
            <QuickSetupLayout pageTitle={'What\'s in your tech squad? Introduce your machines.'}
                              headerColor={'primary'}>
                <MachinesSetupWidget header={'signup.finishMachinesHeader'} nextStep={'/quick-setup/materials/pricing'} categories={machinesCategories.filter(category => !notIncludedCategories?.includes(category.id)).map(category => category.id)}/>
            </QuickSetupLayout>
        </CustomerAuthLayout>
    );
}