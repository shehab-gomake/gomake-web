import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FONT_FAMILY } from "@/utils/font-family";
import { EditIcon } from "@/components/icons/edit-icon";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeRouter } from "@/hooks";
import {PrimaryButton} from "@/components/button/primary-button";

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#EBECFF",
    color: "#292929",
    ...FONT_FAMILY.Lexend(500, 14),
  },
  [`&.${tableCellClasses.body}`]: {
    ...FONT_FAMILY.Lexend(500, 14),
    color: "#2E3092",
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(even)": {
    backgroundColor: "#F6F6F6",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const CategoriesTable = ({ admin = false }) => {
  const { t } = useTranslation();
  const { primaryColor } = useGomakeTheme();
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
        path: "/materials-new/wide-format-material",
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
        path: "/admin/materials/material-roll-printing",
      },
      {
        key: "hardboards",
        title: t("tabs.hardboards"),
        path: "/admin/materials/hardboards",
      },
      {
        key: "wideFormatMaterial",
        title: t("tabs.wideFormatMaterial"),
        path: "/admin/materials/wide-format-material",
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

  const { navigate } = useGomakeRouter();
  const selectList = () => {
    return admin ? categoriesAdminList : categoriesList;
  };
  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell align={"center"}>Category</StyledTableCell>
              <StyledTableCell align={"center"}>View Material</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectList()
              .filter((item: any) => item?.path)
              .map((category) => {
                return (
                  <StyledTableRow key={category.key}>
                    <StyledTableCell align={"center"}>
                      {category.title}
                    </StyledTableCell>
                    <StyledTableCell align={"center"}>
                      <PrimaryButton
                        startIcon={
                          <EditIcon
                            color={primaryColor(500)}
                            width={20}
                            height={20}
                          />
                        }
                        onClick={() => {
                          navigate(category.path);
                        }}
                        variant={"text"}
                      >
                        View
                      </PrimaryButton>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
export { CategoriesTable };
