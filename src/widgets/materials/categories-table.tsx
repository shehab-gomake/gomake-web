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
import { useRecoilValue } from "recoil";
import { machineCategoriesState } from "@/store/machine-categories";
import { EditIcon } from "@/components/icons/edit-icon";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { PrimaryButton } from "@/widgets/machines/components/buttons/primary-button";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeRouter } from "@/hooks";

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
const CategoriesTable = () => {
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
        key: "lamination",
        title: t("tabs.lamination"),
        path: "/materials/lamination",
      },
      {
        key: "plats",
        title: t("tabs.plats"),
        path: "/materials-new/plats",
      },
      {
        key: "envelopes",
        title: t("tabs.envelopes"),
        path: "/materials/envelopes",
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
        path: "/materials/hardboards",
      },
      {
        key: "wildPrintingMaterials",
        title: t("tabs.wildPrintingMaterials"),
        path: "/materials/wild-printing-materials",
      },
      {
        key: "profileFrames",
        title: t("tabs.profileFrames"),
        path: "/materials/profile-frames",
      },
      {
        key: "applications",
        title: t("tabs.applications"),
        path: "/materials/applications",
      },
      {
        key: "encapsulationRoll",
        title: t("tabs.encapsulationRoll"),
        path: "/materials/encapsulation-roll",
      },
      {
        key: "additions",
        title: t("tabs.additions"),
        path: "/materials/additions",
      },
      {
        key: "canvasFrames",
        title: t("tabs.canvasFrames"),
        path: "/materials/canvas-frames",
      },
      {
        key: "frames",
        title: t("tabs.frames"),
        path: "/materials-new/frames",
      },
      {
        key: "foils",
        title: t("tabs.foils"),
        path: "/materials/foils",
      },
      {
        key: "packinDrums",
        title: t("tabs.packinDrums"),
        path: "/materials-new/packin-drums",
      },
      {
        key: "packinUnits",
        title: t("tabs.packinUnits"),
        path: "/materials/packin-units",
      },
      {
        key: "sheetEncapsulation",
        title: t("tabs.sheetEncapsulation"),
        path: "/materials-new/sheet-encapsulation",
      },
      {
        key: "colors",
        title: t("tabs.colors"),
        path: "/materials/colors",
      },
      {
        key: "doubleSidedTapeRolls",
        title: t("tabs.doubleSidedTapeRolls"),
        path: "/materials/double-sided-tape-rolls",
      },
      {
        key: "glues",
        title: t("tabs.glues"),
        path: "/materials/glues",
      },
      {
        key: "magnets",
        title: t("tabs.magnets"),
        path: "/materials/magnets",
      },
      {
        key: "packings",
        title: t("tabs.packings"),
        path: "/materials/packings",
      },
      {
        key: "varnishs",
        title: t("tabs.varnishs"),
        path: "/materials/varnishs",
      },
    ];
  }, []);

  const { navigate } = useGomakeRouter();
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
            {categoriesList.map((category) => {
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
