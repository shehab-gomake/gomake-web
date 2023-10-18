import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { convertHeightToVH} from "@/utils/adapter";


const useStyle = () => {
    const { primaryColor, secondColor } = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            iconStyle: {
                color: secondColor(300),
                background: primaryColor(300),
            },
            dropDownListStyle: {
                width: "170px",
                borderRadius: 4,
                height: 40,
                backgroundColor: "#FFF",
                border: "0px",
                boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.08)",
            },
            containerStyle: {
                display: "flex",
                gap: "20px",
                flexDirection: "column" as "column",
                marginTop: "10px"
            },
            headerStyle: {
                ...FONT_FAMILY.Lexend(400, 16),
                color : "#7E7E7E",
                lineHeight: "20px",
            },
            editorStyle1: {
                backgroundColor: "#FFFFFF",
                height: convertHeightToVH(150),
                borderRadius: "0px 0px 12px 12px",
                borderColor : "#9695C7",
                borderWidth :"2px"
              },
              editorStyle2: {
                backgroundColor: "#FFFFFF",
                height: convertHeightToVH(300),
                borderRadius: "0px 0px 12px 12px",
                borderColor : "#9695C7",
              },
            editorToolbarStyle: {
                backgroundColor: primaryColor(50),
                borderRadius: "12px",
              }
        };
    }, []);
    return {
        classes,
    };
};
export { useStyle };
