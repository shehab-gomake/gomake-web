import { EMaterialsId } from "@/widgets/machines/enums";
import { atom } from "recoil";

export const materialsCategoriesState = atom({
  key: "materialsCategoryState",
  default: [
    { id: EMaterialsId.ADDITIONS, name: "Additions" },
    { id: EMaterialsId.APPLICATIONS, name: "Applications" },
    { id: EMaterialsId.CANVAS_FRAMES, name: "CanvasFrames" },
    { id: EMaterialsId.COLORS, name: "Colors" },
    { id: EMaterialsId.DOUBLE_SIDED_TAPE_ROLLS, name: "DoubleSidedTapeRolls" },
    { id: EMaterialsId.ENVELOPES, name: "Envelopes" },
    { id: EMaterialsId.FOILS, name: "Foils" },
    { id: EMaterialsId.FRAMES, name: "Frames" },
    { id: EMaterialsId.GLUES, name: "Glues" },
    { id: EMaterialsId.HARDBOARDS, name: "Hardboards" },
    { id: EMaterialsId.LAMINATIONS, name: "Laminations" },
    { id: EMaterialsId.MAGNETS, name: "Magnets" },
    { id: EMaterialsId.MATERIAL_ROLL_PRINTINGS, name: "MaterialRollPrintings" },
    { id: EMaterialsId.PACKINGS, name: "Packings" },
    { id: EMaterialsId.PACKIN_DRUMS, name: "PackinDrums " },
    { id: EMaterialsId.PACKIN_UNITS, name: "PackinUnits" },
    { id: EMaterialsId.PLATS, name: "Plats" },
    { id: EMaterialsId.PROFILE_FRAMES, name: "ProfileFrames" },
    { id: EMaterialsId.ROLL_ENCAPSULATIONS, name: "RollEncapsulations" },
    { id: EMaterialsId.SHEETS, name: "Sheets" },
    { id: EMaterialsId.SHEET_ENCAPSULATIONS, name: "SheetEncapsulations" },
    { id: EMaterialsId.TUBES, name: "Tubes" },
    { id: EMaterialsId.VARNISHS, name: "Varnishs" },
    { id: EMaterialsId.WIDE_FORMAT_MATERIAL, name: "WideFormatMaterial" },
    { id: EMaterialsId.DIE_STAMP, name: "DieStamp" },
  ],
});
