import PrintIcon from '@mui/icons-material/Print';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SpeedIcon from '@mui/icons-material/Speed';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import PaletteIcon from '@mui/icons-material/Palette';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import {IStep} from "@/widgets/add-machine/interface/step";
import {
    BasicInputsComponent,
    BeatSettingsComponent,
    ColorsInputsComponent,
    FeedersStackersComponent,
    MediaSettingComponent,
    SpeedSettingsComponent
} from "@/widgets/add-machine/printing-machine/forms";
const printingMachineSteps: IStep[] = [
    {label: 'basic', icon: PrintIcon, component: BasicInputsComponent},
    {label: 'media', icon: PhotoCameraIcon, component: MediaSettingComponent},
    {label: 'speed', icon: SpeedIcon, component: SpeedSettingsComponent},
    {label: 'feeders and stackers', icon: StickyNote2Icon, component: FeedersStackersComponent},
    {label: 'colors', icon: PaletteIcon, component: ColorsInputsComponent},
    {label: 'beat', icon: AttachMoneyIcon, component: BeatSettingsComponent}
];

export {printingMachineSteps};