import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { PrimaryButton } from "@/components/button/primary-button";
import { useGomakeRouter } from "@/hooks";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { usePermission } from "@/hooks/use-permission";
import { EditIcon } from "@/icons";
import { permissionsState } from "@/store/permissions";
import { matchSorter } from "match-sorter";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

const useMaterials = ({ admin }: any) => {
  const { t } = useTranslation();
  const { navigate } = useGomakeRouter();
  const { primaryColor } = useGomakeTheme();
  const [term, setTerm] = useState("");
  const { CheckPermission } = usePermission();
  const [materilasSearched, setMaterilasSearched] = useState([]);
  const categoriesList = useMemo(() => {
    return [
      {
        key: "sheetPaper",
        title: t("tabs.sheetPaper"),
        path: "/materials-new/sheet-paper",
      },
      {
        key: "plats",
        title: t("tabs.plats"),
        path: "/materials-new/plats",
      },
      {
        key: "envelopes",
        title: t("tabs.envelopes"),
        path: "/materials-new/envelopes",
      },
      {
        key: "tubes",
        title: t("tabs.tubes"),
        path: "/materials-new/tubes",
      },
      {
        key: "printingMaterialsForRolls",
        title: t("tabs.printingMaterialsForRolls"),
        path: "/materials-new/printing-materials-for-rolls",
      },
      {
        key: "hardboards",
        title: t("tabs.hardboards"),
        path: "/materials-new/hardboards",
      },
      {
        key: "wideFormatMaterial",
        title: t("tabs.wideFormatMaterial"),
        path: "/materials-new/wide-format-materials",
      },
      {
        key: "profileFrames",
        title: t("tabs.profileFrames"),
        path: "/materials-new/profile-frames",
      },
      {
        key: "lamination",
        title: t("tabs.lamination"),
        path: "/materials-new/lamination",
      },
      {
        key: "applications",
        title: t("tabs.applications"),
        path: "/materials-new/applications",
      },
      {
        key: "encapsulationRoll",
        title: t("tabs.encapsulationRoll"),
        path: "/materials-new/roll-encapsulations",
      },
      {
        key: "frames",
        title: t("tabs.frames"),
        path: "/materials-new/frames",
      },
      {
        key: "canvasFrames",
        title: t("tabs.canvasFrames"),
        path: "/materials-new/canvas-frames",
      },
      {
        key: "additions",
        title: t("tabs.additions"),
        path: "/materials-new/additions",
      },
      {
        key: "colors",
        title: t("tabs.colors"),
        path: "/materials-new/colors",
      },
      {
        key: "foils",
        title: t("tabs.foils"),
        path: "/materials-new/foils",
      },
      {
        key: "sheetEncapsulation",
        title: t("tabs.sheetEncapsulation"),
        path: "/materials-new/sheet-encapsulation",
      },
      {
        key: "varnishs",
        title: t("tabs.varnishs"),
        path: "/materials-new/varnishs",
      },
      {
        key: "magnets",
        title: t("tabs.magnets"),
        path: "/materials-new/magnet",
      },
      {
        key: "packinUnits",
        title: t("tabs.packinUnits"),
        path: "/materials-new/packin-units",
      },
      {
        key: "packinDrums",
        title: t("tabs.packinDrums"),
        path: "/materials-new/packin-drums",
      },
      {
        key: "glues",
        title: t("tabs.glues"),
        path: "/materials-new/glue",
      },
      {
        key: "doubleSidedTapeRolls",
        title: t("tabs.doubleSidedTapeRolls"),
        path: "/materials-new/double-sided-tape-rolls",
      },
      {
        key: "packings",
        title: t("tabs.packings"),
        path: "/materials-new/packings",
      },
    ];
  }, []);
  const categoriesAdminList = useMemo(() => {
    return [
      {
        key: "sheetPaper",
        title: t("tabs.sheetPaper"),
        path: "/admin/materials/sheets",
      },
      {
        key: "plats",
        title: t("tabs.plats"),
        path: "/admin/materials/plats",
      },
      {
        key: "envelopes",
        title: t("tabs.envelopes"),
        path: "/admin/materials/envelope",
      },
      {
        key: "tubes",
        title: t("tabs.tubes"),
        path: "/admin/materials/tube",
      },
      {
        key: "printingMaterialsForRolls",
        title: t("tabs.printingMaterialsForRolls"),
        path: "/admin/materials/materials-roll-printing",
      },
      {
        key: "hardboards",
        title: t("tabs.hardboards"),
        path: "/admin/materials/hardboards",
      },
      {
        key: "wideFormatMaterial",
        title: t("tabs.wideFormatMaterial"),
        path: "/admin/materials/wide-format-materials",
      },
      {
        key: "profileFrames",
        title: t("tabs.profileFrames"),
        path: "/admin/materials/profile-frame",
      },
      {
        key: "lamination",
        title: t("tabs.lamination"),
        path: "/admin/materials/lamination",
      },
      {
        key: "applications",
        title: t("tabs.applications"),
        path: "/admin/materials/applications",
      },
      {
        key: "encapsulationRoll",
        title: t("tabs.encapsulationRoll"),
        path: "/admin/materials/roll-encapsulation",
      },
      {
        key: "frames",
        title: t("tabs.frames"),
        path: "/admin/materials/frame",
      },
      {
        key: "canvasFrames",
        title: t("tabs.canvasFrames"),
        path: "/admin/materials/canvans-frames",
      },
      {
        key: "additions",
        title: t("tabs.additions"),
        path: "/admin/materials/additions",
      },
      {
        key: "colors",
        title: t("tabs.colors"),
        path: "/admin/materials/colors",
      },
      {
        key: "foils",
        title: t("tabs.foils"),
        path: "/admin/materials/foil",
      },
      {
        key: "sheetEncapsulation",
        title: t("tabs.sheetEncapsulation"),
        path: "/admin/materials/sheet-encapsulation",
      },
      {
        key: "varnishs",
        title: t("tabs.varnishs"),
        path: "/admin/materials/varnish",
      },
      {
        key: "magnets",
        title: t("tabs.magnets"),
        path: "/admin/materials/magnets",
      },

      {
        key: "packinUnits",
        title: t("tabs.packinUnits"),
        path: "/admin/materials/packin-units",
      },
      {
        key: "packinDrums",
        title: t("tabs.packinDrums"),
        path: "/admin/materials/packin-drums",
      },
      {
        key: "glues",
        title: t("tabs.glues"),
        path: "/admin/materials/glues",
      },
      {
        key: "doubleSidedTapeRolls",
        title: t("tabs.doubleSidedTapeRolls"),
        path: "/admin/materials/double-sided-tape-roll",
      },
      {
        key: "packings",
        title: t("tabs.packings"),
        path: "/admin/materials/packings",
      },
    ];
  }, []);
  const selectList = () => {
    return admin ? categoriesAdminList : categoriesList;
  };
  const tableHeaders = [
    t("materials.sheetPaper.category"),
    CheckPermission(Permissions.EDIT_MATERIAL) ? t("materials.sheetPaper.viewMaterial") : null,
  ];
  const tableRows = selectList()?.map((category) => [
    category.title,
    <PermissionCheck userPermission={Permissions.EDIT_MATERIAL} >
           <PrimaryButton
              startIcon={<EditIcon color={primaryColor(500)} width={20} height={20} />}
              onClick={() => {
                navigate(category.path);
              }}
              variant={"text"}
            >
              {t("materials.sheetPaper.view")}
            </PrimaryButton>
    </PermissionCheck>
 ,
  ]);

  const filterArray = (array: any, searchText: string) =>
    array.filter((item) => {
      const matches = matchSorter([item[0]], searchText);
      return matches.length > 0;
    });

  useEffect(() => {
    if (tableRows?.length) {
      const temp = filterArray(tableRows, term);
      setMaterilasSearched(temp);
    }
  }, [term]);
  return { tableHeaders, tableRows, materilasSearched, term, setTerm };
};

export { useMaterials };
