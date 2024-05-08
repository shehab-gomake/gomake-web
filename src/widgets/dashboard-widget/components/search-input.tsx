import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

export const SearchInput = styled(TextField)(() => {
    const { primaryColor } = useGomakeTheme();
    return {
        input: {
            backgroundColor: "#FFFFFF",
            boxSizing: "border-box",
            borderRadius: '10px',
            height: 40,
            fontFamily: "Jost",
            fontStyle: "normal",
            fontWeight: 300,
            fontSize: 14,
            lineHeight: "21px",
            display: "flex",
            alignItems: "center",
            color: primaryColor(500),
            minWidth: '150px'
        },

        "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
                border: `2px solid ${primaryColor(500)}`

            },
            "& fieldset": {
                border: `1px solid ${primaryColor(500)}`,
                boxSizing: "border-box",
                borderRadius: 10,
                width: "100%",
            },
            "&.Mui-focused fieldset": {
                borderColor: primaryColor(500),
                borderRadius: 10,
                width: "100%",
            },
        },
    }
});