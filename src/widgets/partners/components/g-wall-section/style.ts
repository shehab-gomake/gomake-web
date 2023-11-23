import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { neutralColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      cardStyle: {
        padding: "2.5rem 0 4.5rem",
        border: "1px dotted #c9c8c3",
        textAlign: "center" as "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 4,
        position: "relative" as "relative",
        marginBottom: "2.5rem",
        width: "300px",
        height: "92px",
        boxShadow: "0 1px 0px 0 rgba(0, 0, 0, 0.08), 0 0px 5px 0 rgba(0, 0, 0, 0.08)",
        
      },
      
      numberStyle: {
        
        ...FONT_FAMILY.Lexend(500, 24),
      },
      descStyle: {
        
        color: neutralColor(600),
        ...FONT_FAMILY.Lexend(400, 14),
      }
      //     .icon {
      //       width: 4.5rem;
      //       height: 4.5rem;
      //       border-radius: 50%;
      //       display: flex;
      //       align-items: center;
      //       justify-content: center;
      //       background-color: #fff;
      //       box-shadow: 0px 0px 30px 0px #0000000f;
      //       position: absolute;
      //       left: 50%;
      //       transform: translateX(-50%);
      //       bottom: -2.25rem;
      //       img {
      //         width: 2rem;
      //       }
      //     }
      //   }
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
