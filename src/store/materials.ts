import {atom} from "recoil";
import { useTranslation } from "react-i18next";
import {Materials} from "../widgets/materials/materials"

export const materialsState = atom({
    key:"materialsState",
    default: ()=> {
        const { t } = useTranslation();
        return [
            {id: Materials.ADDITIONS, label:t("materialsTrans.additions")},
            {id: Materials.APPLICATIONS, label:t("materialsTrans.applications")},
            {id: Materials.CANVASFRAMES, label:t("materialsTrans.canvasframes")},
            {id: Materials.COLORS, label:t("materialsTrans.colors")},
            {id: Materials.DOUBLESIDEDTAPEROLLS, label:t("materialsTrans.doublesidedtaperolls")},
            {id: Materials.ENVELOPES, label:t("materialsTrans.envelopes")},
            {id: Materials.FOILS, label:t("materialsTrans.foils")},
            {id: Materials.FRAMES, label:t("materialsTrans.frames")},
            {id: Materials.GLUES, label:t("materialsTrans.glues")},
            {id: Materials.HARDBOARDS, label:t("materialsTrans.hardboards")},
            {id: Materials.LAMINATIONS, label:t("materialsTrans.laminations")},
            {id: Materials.MAGNETS, label:t("materialsTrans.magnets")},
            {id: Materials.MATERIALROLLPRINTINGS, label:t("materialsTrans.materialrollprintings")},
            {id: Materials.PACKINDRUMS, label:t("materialsTrans.packindrums")},
            {id: Materials.PACKINGS, label:t("materialsTrans.packings")},
            {id: Materials.PACKINUNITS, label:t("materialsTrans.packinunits")},
            {id: Materials.PLATS, label:t("materialsTrans.plats")},
            {id: Materials.PROFILEFRAMES, label:t("materialsTrans.profileframes")},
            {id: Materials.ROLLENCAPSULATIONS, label:t("materialsTrans.rollencapsulations")},
            {id: Materials.SHEETENCAPSULATIONS, label:t("materialsTrans.sheetencapsulations")},
            {id: Materials.SHEETS, label:t("materialsTrans.sheets")},
            {id: Materials.TUBES, label:t("materialsTrans.tubes")},
            {id: Materials.VARNISHS, label:t("materialsTrans.varnishs")},
            {id: Materials.WIDEFORMATMATERIAL, label:t("materialsTrans.wideformatmaterial")},
        ]
    }
})




