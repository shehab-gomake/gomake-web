import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
    const { primaryColor} = useGomakeTheme();

    const classes = useMemo(() => {
        return {
            insideStyle: {
                width: "371px",
                padding: "20px",
                borderRadius: "24px",
                position: "relative" as "relative",
                height: "auto",
            },
            saveBtn: {
                width: "331px",
                height: "40px",
                borderRadius: "8px",
            },
            mainContainer: {
                display: "flex",
                flexDirection: "row" as "row",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                width: "100%",
                gap: 24,
                marginTop: 16,
              },
              fieldContainer: {
                display: "flex",
                flexDirection: "column" as "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: "10px",
                width: "15%",
              },
              labelStyle: {
                ...FONT_FAMILY.Lexend(600, 14),
                color: primaryColor(900),
                height: 20,
              },
              addBtnStyle: {
                ...FONT_FAMILY.Lexend(400, 12),
                color: primaryColor(900),
                cursor: "pointer",
              },
              labelContainer: {
                display: "flex",
                flexDirection: "row" as "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 16,
              },
              plusIconContainer: {
                cursor: "pointer",
                width:16,height:20,
              },
              textInputStyle: {
                background: "#FFFFFF",
                filter: "drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.08))",
                // boxShadow: "0px 4px 60px rgba(0, 0, 0, 0.08)",
                borderRadius: 4,
                border: "1px solid #FFFFFF",
                height: 40,
                width: "100%",
              },
              autoComplateStyle: {
                background: "#FFFFFF",
               // filter: "drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.08))",
                // boxShadow: "0px 4px 60px rgba(0, 0, 0, 0.08)",
                borderRadius: 4,
                border: "1px solid #FFFFFF",
                height: 40,
                width: "330px",
              },
              addContactContainer: {
                display: "flex",
                flexDirection: "row" as "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
              },
              addDeleteContainer: {
                display: "flex",
                flexDirection: "row" as "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              },
              addContactStyle: {
                ...FONT_FAMILY.Lexend(400, 12),
                color: primaryColor(900),
              },
              removeContactStyle: {
                ...FONT_FAMILY.Lexend(500, 10),
                color: "#D92C2C",
              },
              noAddressContaner: {
                marginTop: 16,
              },
        };
    }, []);
    return {
        classes,
    };
};
export { useStyle };
