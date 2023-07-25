import {IStep} from "@/widgets/machines/utils/interface/step";
import {ActionsMaterialsComponent} from "@/widgets/machines/components/forms/actions-materials-component";

const adminActionsMaterialsStep: IStep[] = [
    {label: 'actions&materials', component: ActionsMaterialsComponent},
];

export {adminActionsMaterialsStep};