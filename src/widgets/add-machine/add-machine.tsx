import {useStyle} from "@/widgets/add-machine/style";
import {PrintingMachineForm} from "@/widgets/add-machine/printing-machine";

const AddMachine = () => {
    const {classes} = useStyle();
    return (
        <div>
            <h2>Add printing machine</h2>
            <PrintingMachineForm/>
        </div>
    );
}
export {AddMachine}