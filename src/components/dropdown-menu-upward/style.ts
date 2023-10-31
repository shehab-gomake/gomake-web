import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = () => {
  
    const classes = useMemo(() => {
        return {
            redButton: {
                border: '1px solid #C5372C',
                color: '#C5372C',
                background: 'white',
                textTransform: "capitalize" as "capitalize",
              },
              redTitle: {
                color: '#C5372C',
                ...FONT_FAMILY.Lexend(500, 16),
           
              },
              customMenu: {
                width: '200px', 
                marginTop: '-15px',
                borderRadius:"8px", 
              },
          
        };
    }, []);
    return {
        classes,
    };
};
export {useStyle};
